-- Public chain data only. Index writes and scheduler authentication are server-only.
create schema if not exists prison_private;
revoke all on schema prison_private from public, anon, authenticated;
grant usage on schema prison_private to service_role;

create table prison_private.indexer_auth (
  singleton boolean primary key default true check (singleton),
  token_hash bytea not null
);
grant select on prison_private.indexer_auth to service_role;

create table public.prison_index_state (
  chain_id bigint not null,
  contract text not null check (contract ~ '^0x[0-9a-f]{40}$'),
  deployment_block bigint not null,
  cursor_block bigint not null,
  cursor_hash text,
  revision integer not null default 0,
  head_block bigint,
  block_timestamp timestamptz,
  indexed_at timestamptz,
  snapshot jsonb,
  primary key (chain_id, contract)
);
create table public.prison_events (
  chain_id bigint not null,
  contract text not null,
  block_number bigint not null,
  block_hash text not null,
  transaction_hash text not null,
  transaction_index integer not null,
  log_index integer not null,
  block_timestamp timestamptz not null,
  event_name text not null,
  args jsonb not null,
  primary key (chain_id, contract, transaction_hash, log_index),
  foreign key (chain_id, contract) references public.prison_index_state
);
create index prison_events_block_idx on public.prison_events
  (chain_id, contract, block_number, transaction_index, log_index);
create index prison_events_name_idx on public.prison_events
  (chain_id, contract, event_name);
alter table public.prison_index_state enable row level security;
alter table public.prison_events enable row level security;
create policy prison_state_public_read on public.prison_index_state for select to anon, authenticated using (true);
create policy prison_events_public_read on public.prison_events for select to anon, authenticated using (true);
revoke all on public.prison_index_state, public.prison_events from anon, authenticated;
grant select on public.prison_index_state, public.prison_events to anon, authenticated;
grant all on public.prison_index_state, public.prison_events to service_role;

-- A bid increase replaces the total AND the tie priority. Winning payments leave
-- the standing bid book at DrawStarted; a subsequent bid by that wallet is new.
create view public.prison_bids with (security_invoker = true) as
with changes as (
  select *, lower(case when event_name = 'DrawStarted' then args->>'winner'
    else args->>'bidder' end) as bidder
  from public.prison_events
  where event_name in ('BidPlaced', 'BidCancelled', 'DrawStarted')
), latest as (
  select *, row_number() over (partition by chain_id, contract, bidder
    order by block_number desc, transaction_index desc, log_index desc) as position
  from changes
)
select chain_id, contract, bidder, (args->>'amount')::numeric(78,0) as amount,
  (args->>'sequence')::numeric(78,0) as sequence
from latest where position = 1 and event_name = 'BidPlaced';

create view public.prison_draws with (security_invoker = true) as
with grouped as (
  select chain_id, contract,
    coalesce(args->>'drawId', nullif(args->>'abortedDrawId', '0'))::bigint as draw_id,
    jsonb_object_agg(event_name, jsonb_build_object(
      'args', args, 'at', block_timestamp, 'tx', transaction_hash
    ) order by block_number, transaction_index, log_index) as events
  from public.prison_events
  where event_name in ('DrawStarted', 'RandomnessReceived', 'DrawFinalized',
    'BonusAwarded', 'NFTClaimed', 'BonusClaimed', 'Shutdown')
  group by chain_id, contract, coalesce(args->>'drawId', nullif(args->>'abortedDrawId', '0'))::bigint
)
select chain_id, contract, draw_id,
  lower(events#>>'{DrawStarted,args,winner}') as winner,
  (events#>>'{DrawStarted,args,price}')::numeric(78,0) as price,
  case when events ? 'Shutdown' then 'aborted'
    when events ? 'DrawFinalized' then 'finalized'
    when events ? 'RandomnessReceived' then 'ready' else 'requested' end as status,
  (events#>>'{DrawStarted,at}')::timestamptz as started_at,
  (events#>>'{DrawFinalized,at}')::timestamptz as finalized_at,
  events#>>'{DrawStarted,tx}' as start_tx,
  events#>>'{DrawFinalized,tx}' as finalize_tx,
  events#>>'{DrawStarted,args,requestId}' as request_id,
  lower(events#>>'{DrawFinalized,args,collection}') as collection,
  events#>>'{DrawFinalized,args,tokenId}' as token_id,
  events#>>'{BonusAwarded,args,tokenId}' as box_token_id,
  events ? 'NFTClaimed' as claimed,
  events ? 'BonusClaimed' as bonus_claimed,
  lower(events#>>'{NFTClaimed,args,recipient}') as recipient,
  lower(events#>>'{BonusClaimed,args,recipient}') as bonus_recipient,
  events#>>'{NFTClaimed,tx}' as claim_tx,
  events#>>'{BonusClaimed,tx}' as bonus_claim_tx
from grouped where events ? 'DrawStarted';
grant select on public.prison_bids, public.prison_draws to anon, authenticated, service_role;

-- Commit a canonical block range and its snapshot together. A revision check
-- prevents overlapping cron runs from moving the cursor backwards. Replacing
-- the overlap removes orphaned events, including logs absent from the new chain.
create function public.prison_commit_index(
  p_chain_id bigint, p_contract text, p_revision integer,
  p_from_block bigint, p_to_block bigint, p_block_hash text,
  p_head_block bigint, p_block_timestamp timestamptz,
  p_snapshot jsonb, p_events jsonb
) returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_state public.prison_index_state;
begin
  select * into strict current_state from public.prison_index_state
    where chain_id = p_chain_id and contract = p_contract for update;
  if current_state.revision <> p_revision then return false; end if;
  if p_from_block < current_state.deployment_block or p_to_block < p_from_block
    or p_from_block > current_state.cursor_block + 1 or p_head_block < p_to_block then
    raise exception 'Invalid index range';
  end if;
  if exists (select 1 from jsonb_array_elements(p_events) e
    where (e->>'block_number')::bigint not between p_from_block and p_to_block) then
    raise exception 'Event outside index range';
  end if;
  delete from public.prison_events where chain_id = p_chain_id and contract = p_contract
    and block_number >= p_from_block;
  insert into public.prison_events
    select p_chain_id, p_contract, e.block_number, e.block_hash, e.transaction_hash,
      e.transaction_index, e.log_index, e.block_timestamp, e.event_name, e.args
    from jsonb_to_recordset(p_events) as e(block_number bigint, block_hash text,
      transaction_hash text, transaction_index integer, log_index integer,
      block_timestamp timestamptz, event_name text, args jsonb);
  update public.prison_index_state set cursor_block = p_to_block, cursor_hash = p_block_hash,
    revision = revision + 1, head_block = p_head_block, block_timestamp = p_block_timestamp,
    indexed_at = now(), snapshot = p_snapshot
    where chain_id = p_chain_id and contract = p_contract;
  return true;
end $$;
revoke all on function public.prison_commit_index(bigint,text,integer,bigint,bigint,text,bigint,timestamptz,jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.prison_commit_index(bigint,text,integer,bigint,bigint,text,bigint,timestamptz,jsonb,jsonb) to service_role;

create function public.prison_indexer_authorized(p_token text) returns boolean
language sql stable security invoker set search_path = '' as $$
  select exists (select 1 from prison_private.indexer_auth
    where token_hash = extensions.digest(p_token, 'sha256'));
$$;
revoke all on function public.prison_indexer_authorized(text) from public, anon, authenticated;
grant execute on function public.prison_indexer_authorized(text) to service_role;

-- One SQL statement gives the page a coherent view. Serialize wei/uint256 as
-- strings so JavaScript never rounds them. Bound both pagination and payloads.
create function public.prison_read_index(p_chain_id bigint, p_contract text, p_page integer default 0)
returns jsonb language sql stable security invoker set search_path = '' as $$
select jsonb_build_object(
  'chainId', s.chain_id, 'contract', s.contract,
  'blockNumber', s.cursor_block, 'headBlock', s.head_block,
  'blockTimestamp', s.block_timestamp, 'indexedAt', s.indexed_at,
  'snapshot', s.snapshot,
  'bidderCount', (select count(*) from public.prison_bids b where b.chain_id = s.chain_id and b.contract = s.contract),
  'leaderboard', coalesce((select jsonb_agg(b.value order by b.amount desc, b.sequence asc) from (
    select amount, sequence, jsonb_build_object('bidder', bidder, 'amount', amount::text,
      'sequence', sequence::text) as value
    from public.prison_bids where chain_id = s.chain_id and contract = s.contract
    order by amount desc, sequence asc limit 50
  ) b), '[]'::jsonb),
  'drawCount', (select count(*) from public.prison_draws d where d.chain_id = s.chain_id and d.contract = s.contract),
  'finalizedCount', (select count(*) from public.prison_draws d where d.chain_id = s.chain_id and d.contract = s.contract and d.status = 'finalized'),
  'totalWonWei', (select coalesce(sum(price),0)::text from public.prison_draws d where d.chain_id = s.chain_id and d.contract = s.contract and d.status = 'finalized'),
  'history', coalesce((select jsonb_agg(d.value order by d.draw_id desc) from (
    select draw_id, jsonb_build_object(
      'id', draw_id::text, 'winner', winner, 'price', price::text, 'status', status,
      'startedAt', started_at, 'finalizedAt', finalized_at, 'startTx', start_tx,
      'finalizeTx', finalize_tx, 'requestId', request_id, 'collection', collection,
      'tokenId', token_id, 'boxTokenId', box_token_id, 'claimed', claimed,
      'bonusClaimed', bonus_claimed, 'recipient', recipient, 'bonusRecipient', bonus_recipient,
      'claimTx', claim_tx, 'bonusClaimTx', bonus_claim_tx) as value
    from public.prison_draws where chain_id = s.chain_id and contract = s.contract
    order by draw_id desc limit 20 offset greatest(0, least(p_page, 10000)) * 20
  ) d), '[]'::jsonb)
) from public.prison_index_state s where s.chain_id = p_chain_id and s.contract = lower(p_contract);
$$;
revoke all on function public.prison_read_index(bigint,text,integer) from public;
grant execute on function public.prison_read_index(bigint,text,integer) to anon, authenticated, service_role;

insert into public.prison_index_state(chain_id, contract, deployment_block, cursor_block)
values (1, '0x7a258a7ed776d88ec7e19a03019a632c4f097ef8', 26428270, 26428269);

-- Generate the cron credential inside Postgres; never put it in source or logs.
do $$
declare token text;
begin
  token := encode(extensions.gen_random_bytes(32), 'hex');
  perform vault.create_secret(token, 'prison_indexer_token', 'Forgotten Prison indexer cron authentication');
  insert into prison_private.indexer_auth(singleton, token_hash)
    values (true, extensions.digest(token, 'sha256'));
end $$;
