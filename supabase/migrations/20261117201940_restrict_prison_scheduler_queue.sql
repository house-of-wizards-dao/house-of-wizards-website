-- pg_net's request queue briefly contains the scheduler's secret header. This
-- feature installed pg_net; keep its tables and functions server-only.
revoke all on schema net from public, anon, authenticated;
revoke all on all tables in schema net from public, anon, authenticated;
revoke all on all sequences in schema net from public, anon, authenticated;
revoke all on all functions in schema net from public, anon, authenticated;

-- Rotate the newly created token after tightening the queue permissions.
do $$
declare token text; secret_id uuid;
begin
  select id into strict secret_id from vault.secrets where name = 'prison_indexer_token';
  token := encode(extensions.gen_random_bytes(32), 'hex');
  perform vault.update_secret(secret_id, token);
  update prison_private.indexer_auth set token_hash = extensions.digest(token, 'sha256')
    where singleton;
end $$;
