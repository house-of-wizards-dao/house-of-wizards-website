begin;
do $test$
declare
  prison text := '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  warrior text := '0x9690b63eb85467be5267a3603f770589ab12dc95';
  wizard text := '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42';
  lifecycle text[] := array['InventoryDeposited','DrawFinalized','NFTClaimed','InventoryDeposited','UnsoldNFTRecovered'];
  states text[] := array['available','awarded','claimed','available','recovered'];
  payload jsonb := '[]';
  record jsonb;
  result jsonb;
  i integer;
begin
  insert into public.prison_index_state(chain_id,contract,deployment_block,cursor_block)
    values(31337,prison,100,99);
  insert into public.prison_nft_metadata(chain_id,collection,token_id,name,image_url)
    values(31337,warrior,'0','Test Warrior','https://portal.forgottenrunes.com/api/warriors/img/0.png');
  for i in 1..5 loop
    record := jsonb_build_object('block_number',99+i,'block_hash','block'||i,
      'transaction_hash','0x'||lpad(i::text,64,'0'),'transaction_index',0,'log_index',0,
      'block_timestamp','2026-11-18T00:00:00Z','event_name',lifecycle[i],
      'args',jsonb_build_object('collection',warrior,'tokenId','0') ||
        case when i in (2,3) then '{"drawId":"1"}'::jsonb else '{}'::jsonb end);
    payload := payload || jsonb_build_array(record);
    assert public.prison_commit_index(31337,prison,i-1,100,99+i,'block'||i,110,now(),'{}',payload);
    assert (select status from public.prison_inventory where chain_id=31337 and contract=prison)=states[i], 'lifecycle membership';
    result := public.prison_read_index(31337,prison,0);
    assert result#>>'{prizes,0,name}'='Test Warrior', 'cached name must survive leaving pool';
    assert result#>>'{prizes,0,tokenId}'='0', 'token zero must survive JSON serialization';
    assert result#>>'{prizes,0,imageUrl}' like 'https://portal.forgottenrunes.com/%', 'cached image URL';
  end loop;
  -- Replacing the last block removes recovery and reinstates the returned prize.
  payload := payload - 4;
  assert public.prison_commit_index(31337,prison,5,100,103,'replacement',110,now(),'{}',payload);
  assert (select status from public.prison_inventory where chain_id=31337 and contract=prison)='available', 'reorg must restore pool membership';
  assert (select draw_id from public.prison_inventory where chain_id=31337 and contract=prison) is null, 'new deposit must clear previous award association';
  -- Equal token IDs in different collections must not collide.
  insert into public.prison_events values(31337,prison,104,'b','0x'||repeat('a',64),0,0,now(),
    'InventoryDeposited',jsonb_build_object('collection',wizard,'tokenId','0'));
  assert (select count(*) from public.prison_inventory where chain_id=31337 and contract=prison)=2, 'cross-collection identity';
  assert (select name from public.prison_inventory where chain_id=31337 and contract=prison and collection=wizard) is null, 'missing metadata must still display inventory';
  assert not has_table_privilege('anon','public.prison_nft_metadata','insert'), 'public metadata writes';
  assert not has_table_privilege('authenticated','public.prison_nft_metadata','update'), 'public metadata edits';
end $test$;
set local role anon;
do $access$
begin
  assert jsonb_array_length(public.prison_read_prizes(31337,'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'))=2, 'public RLS reads';
end $access$;
reset role;
rollback;
select 'Passed: deposit, award before claim, claim, return, recovery, reorg, cached metadata, identities and permissions' as result;
