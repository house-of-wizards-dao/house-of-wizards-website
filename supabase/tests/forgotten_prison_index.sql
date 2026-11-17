-- Run in a transaction: synthetic rows never become visible to other sessions.
-- Tests the actual Postgres projections and atomic cursor, not a mock database.
begin;
set local role service_role;
do $test$
declare
  address constant text := '0x000000000000000000000000000000000000dead';
  events jsonb := '[{"block_number": 100, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000064", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000064", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "amount": "100", "sequence": "1"}}, {"block_number": 101, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000065", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000065", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "amount": "200", "sequence": "2"}}, {"block_number": 102, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000066", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000066", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "amount": "200", "sequence": "3"}}, {"block_number": 103, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000067", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000067", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "amount": "90071992547409930001", "sequence": "4"}}, {"block_number": 104, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000068", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000068", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xcccccccccccccccccccccccccccccccccccccccc", "amount": "50", "sequence": "5"}}, {"block_number": 105, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000069", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000069", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidCancelled", "args": {"bidder": "0xcccccccccccccccccccccccccccccccccccccccc", "recipient": "0xcccccccccccccccccccccccccccccccccccccccc", "amount": "50"}}, {"block_number": 106, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006a", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006a", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "DrawStarted", "args": {"drawId": "1", "winner": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "price": "90071992547409930001", "requestId": "123", "inventorySize": "355", "boxInventorySize": "114"}}, {"block_number": 107, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006b", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006b", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "amount": "10", "sequence": "6"}}, {"block_number": 108, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006c", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006c", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "RandomnessReceived", "args": {"drawId": "1", "requestId": "123"}}, {"block_number": 109, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006d", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006d", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BonusAwarded", "args": {"drawId": "1", "winner": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "tokenId": "0"}}, {"block_number": 109, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006d", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006d", "transaction_index": 0, "log_index": 1, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "DrawFinalized", "args": {"drawId": "1", "winner": "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", "collection": "0xcccccccccccccccccccccccccccccccccccccccc", "tokenId": "0", "price": "90071992547409930001"}}, {"block_number": 110, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006e", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006e", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BonusClaimed", "args": {"drawId": "1", "recipient": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "tokenId": "0"}}, {"block_number": 111, "block_hash": "0x000000000000000000000000000000000000000000000000000000000000006f", "transaction_hash": "0x000000000000000000000000000000000000000000000000000000000000006f", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "NFTClaimed", "args": {"drawId": "1", "recipient": "0xcccccccccccccccccccccccccccccccccccccccc", "collection": "0xcccccccccccccccccccccccccccccccccccccccc", "tokenId": "0"}}, {"block_number": 112, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000070", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000070", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "DrawStarted", "args": {"drawId": "2", "winner": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "price": "200", "requestId": "124", "inventorySize": "354", "boxInventorySize": "113"}}, {"block_number": 113, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000071", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000071", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "BidPlaced", "args": {"bidder": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "amount": "20", "sequence": "7"}}, {"block_number": 114, "block_hash": "0x0000000000000000000000000000000000000000000000000000000000000072", "transaction_hash": "0x0000000000000000000000000000000000000000000000000000000000000072", "transaction_index": 0, "log_index": 0, "block_timestamp": "2026-11-17T12:00:00Z", "event_name": "Shutdown", "args": {"abortedDrawId": "2"}}]'::jsonb;
  early jsonb;
  result jsonb;
  committed boolean;
begin
  insert into public.prison_index_state(chain_id,contract,deployment_block,cursor_block)
    values (31337,address,100,99);
  select jsonb_agg(e) into early from jsonb_array_elements(events) e where (e->>'block_number')::int <= 102;
  committed := public.prison_commit_index(31337,address,0,100,102,'hash102',114,now(),'{}',early);
  assert committed, 'first commit';
  result := public.prison_read_index(31337,address,0);
  assert result#>>'{leaderboard,0,bidder}' = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'tie priority must reflect last increase';
  assert result#>>'{leaderboard,1,amount}' = '200', 'bid amount is a total, not an increment';
  assert not public.prison_commit_index(31337,address,0,100,102,'stale',114,now(),'{}','[]'), 'stale worker must lose CAS';
  assert (select cursor_hash from public.prison_index_state where chain_id=31337 and contract=address)='hash102', 'stale worker changed cursor';
  assert public.prison_commit_index(31337,address,1,100,102,'hash102',114,now(),'{}',early), 'retry replay';
  assert (select count(*) from public.prison_events where chain_id=31337 and contract=address)=3, 'retry duplicated events';
  assert public.prison_commit_index(31337,address,2,100,114,'hash114',114,now(),'{}',events), 'full lifecycle commit';
  result := public.prison_read_index(31337,address,0);
  assert result->>'bidderCount'='2', 'cancelled bid or locked payment leaked into leaderboard';
  assert result#>>'{leaderboard,0,bidder}'='0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' and result#>>'{leaderboard,0,amount}'='20', 'fresh winner bid missing';
  assert result->>'finalizedCount'='1' and result->>'totalWonWei'='90071992547409930001', 'aborted draw counted or wei rounded';
  assert result#>>'{history,0,status}'='aborted', 'shutdown state';
  assert result#>>'{history,1,status}'='finalized', 'finalized state';
  assert result#>>'{history,1,boxTokenId}'='0' and result#>>'{history,1,tokenId}'='0', 'zero NFT IDs lost';
  assert result#>>'{history,1,claimed}'='true' and result#>>'{history,1,bonusClaimed}'='true', 'claim state';
  assert result#>>'{history,1,recipient}'='0xcccccccccccccccccccccccccccccccccccccccc' and result#>>'{history,1,bonusRecipient}'='0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'independent claim recipients';
  assert jsonb_array_length(public.prison_read_index(31337,address,1)->'history')=0, 'pagination';
  -- A replacement chain ends before finalization: orphaned prizes and claims disappear.
  select jsonb_agg(e) into early from jsonb_array_elements(events) e where (e->>'block_number')::int <= 108;
  assert public.prison_commit_index(31337,address,3,100,108,'replacement108',114,now(),null,early), 'reorg replay';
  result := public.prison_read_index(31337,address,0);
  assert result->>'drawCount'='1' and result#>>'{history,0,status}'='ready', 'reorg draw state';
  assert result#>>'{history,0,claimed}'='false' and result->>'totalWonWei'='0', 'orphaned claims or proceeds remain';
  assert result#>>'{leaderboard,0,amount}'='200', 'reorg must restore removed standing bid';
  assert not has_function_privilege('anon','public.prison_commit_index(bigint,text,integer,bigint,bigint,text,bigint,timestamptz,jsonb,jsonb)','execute'), 'anonymous index writes';
  assert not has_function_privilege('authenticated','public.prison_authorize_indexer(bigint,text,text)','execute'), 'public scheduler auth';
  assert not has_table_privilege('anon','public.prison_events','insert'), 'anonymous event insertion';
  assert not has_schema_privilege('anon','prison_private','usage'), 'public signing key access';
  assert not public.prison_authorize_indexer(0,repeat('0',32),repeat('0',64)), 'invalid scheduler signature accepted';
end $test$;
do $auth$
declare
  ts bigint := extract(epoch from now())::bigint;
  nonce text := encode(extensions.gen_random_bytes(16), 'hex');
  key bytea;
  signature text;
begin
  select token_hash into strict key from prison_private.indexer_auth;
  signature := encode(extensions.hmac(convert_to(ts::text || ':' || nonce,'UTF8'),key,'sha256'),'hex');
  assert public.prison_authorize_indexer(ts,nonce,signature), 'valid signature rejected';
  assert not public.prison_authorize_indexer(ts,nonce,signature), 'replay accepted';
  assert not public.prison_authorize_indexer(ts,repeat('f',32),signature), 'tampered nonce accepted';
  nonce := encode(extensions.gen_random_bytes(16), 'hex');
  assert not public.prison_authorize_indexer(ts,nonce,repeat('0',64)), 'bad signature accepted';
  signature := encode(extensions.hmac(convert_to((ts-121)::text || ':' || nonce,'UTF8'),key,'sha256'),'hex');
  assert not public.prison_authorize_indexer(ts-121,nonce,signature), 'expired signature accepted';
  signature := encode(extensions.hmac(convert_to((ts+31)::text || ':' || nonce,'UTF8'),key,'sha256'),'hex');
  assert not public.prison_authorize_indexer(ts+31,nonce,signature), 'future signature accepted';
end $auth$;
rollback;
select 'Passed: ordering, exact wei, lifecycle, independent claims, retry, CAS, reorg, pagination, permissions, signed auth, expiry, replay prevention' as result;
