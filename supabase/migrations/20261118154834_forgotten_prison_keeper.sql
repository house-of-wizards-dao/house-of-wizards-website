-- Signing stays inside the Edge Function. Only signed, fixed-purpose transactions
-- are persisted here, before broadcast, so retries reuse the same nonce and hash.
create table prison_private.keeper_auth (
  singleton boolean primary key default true check (singleton),
  token_hash bytea not null
);
create table prison_private.keeper_nonces (
  nonce text primary key,
  used_at timestamptz not null default now()
);
create table prison_private.keeper_state (
  singleton boolean primary key default true check (singleton),
  enabled boolean not null default false,
  wallet_address text check (wallet_address ~ '^0x[0-9a-f]{40}$'),
  max_fee_wei bigint not null default 5000000000 check (max_fee_wei > 0),
  max_priority_fee_wei bigint not null default 1000000000 check (max_priority_fee_wei > 0),
  max_gas bigint not null default 750000 check (max_gas between 21000 and 1000000),
  max_tx_cost_wei bigint not null default 3000000000000000 check (max_tx_cost_wei > 0),
  max_24h_cost_wei bigint not null default 10000000000000000 check (max_24h_cost_wei > 0),
  lease_id uuid,
  lease_until timestamptz,
  last_checked_at timestamptz,
  last_status text,
  last_detail jsonb,
  balance_wei numeric(78,0),
  pause_reason text
);
insert into prison_private.keeper_state(singleton) values (true);
create table prison_private.keeper_transactions (
  hash text primary key check (hash ~ '^0x[0-9a-f]{64}$'),
  signer text not null check (signer ~ '^0x[0-9a-f]{40}$'),
  nonce bigint not null check (nonce >= 0),
  action text not null check (action in ('startDailyDraw','finalizeDraw')),
  intent text not null check (intent ~ '^(start|finalize):[0-9]+$'),
  raw_tx text not null check (raw_tx ~ '^0x02[0-9a-f]+$' and length(raw_tx) < 2048),
  max_cost_wei bigint not null check (max_cost_wei > 0),
  status text not null default 'prepared'
    check (status in ('prepared','broadcast','confirmed','reverted','nonce_conflict')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  receipt_block bigint,
  actual_cost_wei numeric(78,0),
  unique (signer,nonce)
);
create unique index prison_keeper_one_pending on prison_private.keeper_transactions ((true))
  where status in ('prepared','broadcast');
create index prison_keeper_recent on prison_private.keeper_transactions(created_at);
alter table prison_private.keeper_auth enable row level security;
alter table prison_private.keeper_nonces enable row level security;
alter table prison_private.keeper_state enable row level security;
alter table prison_private.keeper_transactions enable row level security;
revoke all on prison_private.keeper_auth, prison_private.keeper_nonces,
  prison_private.keeper_state, prison_private.keeper_transactions from public, anon, authenticated;
grant select on prison_private.keeper_auth to service_role;
grant select,insert,delete on prison_private.keeper_nonces to service_role;
grant select,update on prison_private.keeper_state to service_role;
grant select,insert,update on prison_private.keeper_transactions to service_role;

do $$
declare token text := encode(extensions.gen_random_bytes(32),'hex');
begin
  perform vault.create_secret(token,'prison_keeper_token');
  insert into prison_private.keeper_auth(token_hash) values (extensions.digest(token,'sha256'));
end $$;

create function public.prison_authorize_keeper(p_timestamp bigint,p_nonce text,p_signature text)
returns boolean language plpgsql security invoker set search_path='' as $$
declare accepted boolean := false;
begin
  if p_timestamp is null or p_nonce is null or p_signature is null
    or p_nonce !~ '^[a-f0-9]{32}$' or p_signature !~ '^[a-f0-9]{64}$'
    or p_timestamp < extract(epoch from now())::bigint - 120
    or p_timestamp > extract(epoch from now())::bigint + 30 then return false; end if;
  if not exists (select 1 from prison_private.keeper_auth where
    encode(extensions.hmac(convert_to('keeper:v1:'||p_timestamp::text||':'||p_nonce,'UTF8'),token_hash,'sha256'),'hex')=p_signature)
    then return false; end if;
  delete from prison_private.keeper_nonces where used_at < now()-interval '5 minutes';
  insert into prison_private.keeper_nonces(nonce) values (p_nonce)
    on conflict do nothing returning true into accepted;
  return coalesce(accepted,false);
end $$;

create function public.prison_keeper_acquire(p_lease uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare s prison_private.keeper_state; pending jsonb;
begin
  if p_lease is null then return null; end if;
  update prison_private.keeper_state set lease_id=p_lease,lease_until=now()+interval '3 minutes'
    where singleton and (lease_until is null or lease_until < now()) returning * into s;
  if not found then return null; end if;
  select jsonb_build_object('hash',hash,'signer',signer,'nonce',nonce::text,'action',action,
    'intent',intent,'rawTx',raw_tx,'maxCostWei',max_cost_wei::text,'createdAt',created_at)
    into pending from prison_private.keeper_transactions where status in ('prepared','broadcast');
  return jsonb_build_object('enabled',s.enabled,'walletAddress',s.wallet_address,
    'maxFeeWei',s.max_fee_wei::text,'maxPriorityFeeWei',s.max_priority_fee_wei::text,
    'maxGas',s.max_gas::text,'maxTxCostWei',s.max_tx_cost_wei::text,
    'max24hCostWei',s.max_24h_cost_wei::text,'pending',pending);
end $$;

create function public.prison_keeper_finish(p_lease uuid,p_status text,p_detail jsonb,
  p_wallet text default null,p_balance text default null)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
  update prison_private.keeper_state set last_checked_at=now(),last_status=p_status,
    last_detail=p_detail,wallet_address=coalesce(wallet_address,lower(p_wallet)),
    balance_wei=case when p_balance is null then balance_wei else p_balance::numeric end,
    lease_id=null,lease_until=null
    where singleton and lease_id=p_lease and lease_until > now();
  return found;
end $$;

create function public.prison_keeper_reserve(p_lease uuid,p_tx jsonb)
returns boolean language plpgsql security invoker set search_path='' as $$
declare s prison_private.keeper_state; reserved numeric;
begin
  select * into strict s from prison_private.keeper_state where singleton for update;
  if p_lease is null or not s.enabled or s.lease_id is distinct from p_lease
    or s.lease_until is null or s.lease_until <= now()
    or s.wallet_address is null or s.wallet_address is distinct from p_tx->>'signer'
    or (p_tx->>'maxCostWei')::bigint > s.max_tx_cost_wei
    or exists(select 1 from prison_private.keeper_transactions where status in ('prepared','broadcast'))
    then return false; end if;
  -- Reserve worst-case fees, even for failed sends, rather than relying on an RPC
  -- receipt or refund arriving in time. The budget is a rolling 24 hours.
  select coalesce(sum(max_cost_wei),0) into reserved from prison_private.keeper_transactions
    where created_at > now()-interval '24 hours';
  if reserved+(p_tx->>'maxCostWei')::bigint > s.max_24h_cost_wei then return false; end if;
  insert into prison_private.keeper_transactions(hash,signer,nonce,action,intent,raw_tx,max_cost_wei)
    values(p_tx->>'hash',p_tx->>'signer',(p_tx->>'nonce')::bigint,p_tx->>'action',p_tx->>'intent',p_tx->>'rawTx',
      (p_tx->>'maxCostWei')::bigint) on conflict do nothing;
  return found;
end $$;

create function public.prison_keeper_may_broadcast(p_lease uuid,p_hash text)
returns boolean language sql security invoker set search_path='' as $$
  select exists(select 1 from prison_private.keeper_state s,prison_private.keeper_transactions t
    where s.singleton and s.enabled and s.lease_id=p_lease and s.lease_until > now()+interval '30 seconds'
      and t.hash=p_hash and t.signer=s.wallet_address and t.status in ('prepared','broadcast'));
$$;

create function public.prison_keeper_tx_result(p_lease uuid,p_hash text,p_status text,
  p_block bigint default null,p_cost text default null)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
  perform 1 from prison_private.keeper_state where singleton and lease_id=p_lease
    and lease_until > now() for update;
  if not found or p_status not in ('broadcast','confirmed','reverted','nonce_conflict') then return false; end if;
  update prison_private.keeper_transactions set status=p_status,updated_at=now(),
    receipt_block=p_block,actual_cost_wei=p_cost::numeric
    where hash=p_hash and status in ('prepared','broadcast');
  if not found then return false; end if;
  if p_status in ('reverted','nonce_conflict') then
    update prison_private.keeper_state set enabled=false,pause_reason=p_status where singleton;
  end if;
  return true;
end $$;

revoke all on function public.prison_authorize_keeper(bigint,text,text),
  public.prison_keeper_acquire(uuid),public.prison_keeper_finish(uuid,text,jsonb,text,text),
  public.prison_keeper_reserve(uuid,jsonb),public.prison_keeper_may_broadcast(uuid,text),
  public.prison_keeper_tx_result(uuid,text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.prison_authorize_keeper(bigint,text,text),
  public.prison_keeper_acquire(uuid),public.prison_keeper_finish(uuid,text,jsonb,text,text),
  public.prison_keeper_reserve(uuid,jsonb),public.prison_keeper_may_broadcast(uuid,text),
  public.prison_keeper_tx_result(uuid,text,text,bigint,text) to service_role;

-- The cron and transaction switch both start disabled. A signed manual invocation
-- can verify the secret/address/balance without signing or broadcasting anything.
select cron.schedule('forgotten-prison-keeper','* * * * *',$job$
  with payload as (select extract(epoch from now())::bigint ts,
    encode(extensions.gen_random_bytes(16),'hex') nonce)
  select net.http_post(
    url:='https://sgypzehngyhcdvtwlwst.supabase.co/functions/v1/prison-keeper',
    headers:=jsonb_build_object('Content-Type','application/json',
      'x-prison-timestamp',ts::text,'x-prison-nonce',nonce,
      'x-prison-signature',encode(extensions.hmac(convert_to('keeper:v1:'||ts::text||':'||nonce,'UTF8'),
        (select extensions.digest(decrypted_secret,'sha256') from vault.decrypted_secrets
          where name='prison_keeper_token'),'sha256'),'hex')),
    body:='{}'::jsonb,timeout_milliseconds:=120000) from payload;
$job$);
select cron.alter_job((select jobid from cron.job where jobname='forgotten-prison-keeper'),active:=false);
