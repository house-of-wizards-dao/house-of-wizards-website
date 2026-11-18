-- Durable display data is independent of event replay: keep metadata when a
-- prize leaves the pool so old winnings never require an NFT metadata request.
create table public.prison_nft_metadata (
  chain_id bigint not null,
  collection text not null check (collection in (
    '0x9690b63eb85467be5267a3603f770589ab12dc95',
    '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42')),
  token_id text not null check (token_id ~ '^(0|[1-9][0-9]*)$'),
  name text not null check (length(name) between 1 and 250),
  image_url text not null check (image_url ~ '^https://(portal|nfts)\.forgottenrunes\.com/'),
  updated_at timestamptz not null default now(),
  primary key (chain_id, collection, token_id)
);
alter table public.prison_nft_metadata enable row level security;
create policy prison_metadata_public_read on public.prison_nft_metadata
  for select to anon, authenticated using (true);
revoke all on public.prison_nft_metadata from public, anon, authenticated;
grant select on public.prison_nft_metadata to anon, authenticated;
grant all on public.prison_nft_metadata to service_role;

-- The most recent lifecycle event determines membership. DrawFinalized removes
-- a prize immediately, even before claim. A later deposit puts it back. Because
-- the indexer replaces orphaned logs, reorgs also restore membership atomically.
create view public.prison_inventory with (security_invoker = true) as
with changes as (
  select *, lower(args->>'collection') as collection, args->>'tokenId' as token_id
  from public.prison_events
  where event_name in ('InventoryDeposited','DrawFinalized','NFTClaimed','UnsoldNFTRecovered')
    and lower(args->>'collection') in (
      '0x9690b63eb85467be5267a3603f770589ab12dc95',
      '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42')
), latest as (
  select distinct on (chain_id,contract,collection,token_id) * from changes
  order by chain_id,contract,collection,token_id,
    block_number desc,transaction_index desc,log_index desc
)
select e.chain_id,e.contract,e.collection,e.token_id,
  case when e.collection='0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42'
    then 'Wizard' else 'Warrior' end as kind,
  case e.event_name when 'InventoryDeposited' then 'available'
    when 'DrawFinalized' then 'awarded' when 'NFTClaimed' then 'claimed'
    else 'recovered' end as status,
  e.args->>'drawId' as draw_id,e.block_timestamp as updated_at,
  e.block_number,e.transaction_hash,m.name,m.image_url
from latest e left join public.prison_nft_metadata m
  on m.chain_id=e.chain_id and m.collection=e.collection and m.token_id=e.token_id;
grant select on public.prison_inventory to anon,authenticated,service_role;

create function public.prison_read_prizes(p_chain_id bigint,p_contract text)
returns jsonb language sql stable security invoker set search_path='' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'collection',collection,'tokenId',token_id,'kind',kind,'status',status,
    'drawId',draw_id,'updatedAt',updated_at,'name',name,'imageUrl',image_url
  ) order by collection,token_id::numeric),'[]'::jsonb)
  from public.prison_inventory where chain_id=p_chain_id and contract=lower(p_contract);
$$;
revoke all on function public.prison_read_prizes(bigint,text) from public;
grant execute on function public.prison_read_prizes(bigint,text) to anon,authenticated,service_role;

-- Include display metadata in the existing page response.
create or replace function public.prison_read_index(p_chain_id bigint, p_contract text, p_page integer default 0)
returns jsonb language sql stable security invoker set search_path = '' as $$
select jsonb_build_object(
  'chainId', s.chain_id, 'contract', s.contract,
  'blockNumber', s.cursor_block, 'headBlock', s.head_block,
  'blockTimestamp', s.block_timestamp, 'indexedAt', s.indexed_at,
  'snapshot', s.snapshot,
  'prizes', public.prison_read_prizes(s.chain_id,s.contract),
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
