-- No chain calls: all changes are rolled back, including auth nonce consumption.
begin;
set local role service_role;
do $test$
declare
  first_lease uuid := gen_random_uuid(); next_lease uuid := gen_random_uuid();
  signer text := '0x0000000000000000000000000000000000000123';
  tx jsonb; acquired jsonb; ts bigint := extract(epoch from now())::bigint;
  nonce text := encode(extensions.gen_random_bytes(16),'hex'); key bytea; signature text;
begin
  assert not has_function_privilege('anon','public.prison_keeper_acquire(uuid)','execute');
  assert not has_function_privilege('authenticated','public.prison_keeper_reserve(uuid,jsonb)','execute');
  assert not has_function_privilege('anon','public.prison_authorize_keeper(bigint,text,text)','execute');
  assert not has_schema_privilege('anon','prison_private','usage');
  select token_hash into strict key from prison_private.keeper_auth;
  signature := encode(extensions.hmac(convert_to('keeper:v1:'||ts::text||':'||nonce,'UTF8'),key,'sha256'),'hex');
  assert public.prison_authorize_keeper(ts,nonce,signature);
  assert not public.prison_authorize_keeper(ts,nonce,signature), 'signature replay accepted';
  nonce := encode(extensions.gen_random_bytes(16),'hex');
  signature := encode(extensions.hmac(convert_to(ts::text||':'||nonce,'UTF8'),key,'sha256'),'hex');
  assert not public.prison_authorize_keeper(ts,nonce,signature), 'cross-function signature accepted';
  signature := encode(extensions.hmac(convert_to('keeper:v1:'||(ts-121)::text||':'||nonce,'UTF8'),key,'sha256'),'hex');
  assert not public.prison_authorize_keeper(ts-121,nonce,signature), 'expired signature accepted';
  update prison_private.keeper_state set lease_id=null,lease_until=null,enabled=false,
    wallet_address=signer,max_tx_cost_wei=100,max_24h_cost_wei=100;
  acquired := public.prison_keeper_acquire(first_lease);
  assert acquired is not null;
  assert public.prison_keeper_acquire(next_lease) is null, 'concurrent lease acquired';
  tx := jsonb_build_object('hash','0x'||repeat('1',64),'signer',signer,'nonce','0',
    'action','startDailyDraw','intent','start:1','rawTx','0x021234','maxCostWei','60');
  assert not public.prison_keeper_reserve(first_lease,tx), 'paused keeper reserved a transaction';
  update prison_private.keeper_state set enabled=true;
  assert not public.prison_keeper_reserve(null,tx), 'missing lease accepted';
  assert public.prison_keeper_reserve(first_lease,tx);
  assert not public.prison_keeper_reserve(first_lease,tx), 'duplicate reservation accepted';
  assert public.prison_keeper_may_broadcast(first_lease,tx->>'hash');
  update prison_private.keeper_state set enabled=false;
  assert not public.prison_keeper_may_broadcast(first_lease,tx->>'hash'), 'pause ignored';
  update prison_private.keeper_state set enabled=true,lease_until=now()-interval '1 second';
  assert not public.prison_keeper_may_broadcast(first_lease,tx->>'hash'), 'expired lease broadcast';
  acquired := public.prison_keeper_acquire(next_lease);
  assert acquired#>>'{pending,hash}'=tx->>'hash', 'pending transaction lost after worker crash';
  assert not public.prison_keeper_finish(first_lease,'stale','{}'), 'stale worker modified state';
  assert not public.prison_keeper_tx_result(first_lease,tx->>'hash','confirmed',1,'1'), 'stale worker settled';
  assert public.prison_keeper_tx_result(next_lease,tx->>'hash','confirmed',1,'1');
  tx := tx || jsonb_build_object('hash','0x'||repeat('2',64),'nonce','1');
  assert not public.prison_keeper_reserve(next_lease,tx), 'rolling fee budget exceeded';
  tx := tx || jsonb_build_object('maxCostWei','40');
  assert public.prison_keeper_reserve(next_lease,tx);
  assert public.prison_keeper_tx_result(next_lease,tx->>'hash','reverted',2,'1');
  assert (select not enabled and pause_reason='reverted' from prison_private.keeper_state), 'revert did not pause';
end $test$;
rollback;
select 'Passed: private access, HMAC domain/expiry/replay, leases, crash recovery, pause, fee budget, revert stop' as result;
