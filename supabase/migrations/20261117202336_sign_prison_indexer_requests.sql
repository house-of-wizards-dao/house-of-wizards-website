-- Managed pg_net ownership can retain public queue grants despite REVOKE.
-- Never enqueue a persistent credential. Sign a timestamp + nonce instead;
-- each signature expires in two minutes and can authorize exactly one run.
create table prison_private.indexer_nonces (
  nonce text primary key,
  used_at timestamptz not null default now()
);
revoke all on prison_private.indexer_nonces from public, anon, authenticated;
grant select, insert, delete on prison_private.indexer_nonces to service_role;

drop function public.prison_indexer_authorized(text);
create function public.prison_authorize_indexer(p_timestamp bigint, p_nonce text, p_signature text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare accepted boolean := false;
begin
  if p_timestamp is null or p_nonce is null or p_signature is null
    or p_nonce !~ '^[a-f0-9]{32}$' or p_signature !~ '^[a-f0-9]{64}$'
    or p_timestamp < extract(epoch from now())::bigint - 120
    or p_timestamp > extract(epoch from now())::bigint + 30 then return false; end if;
  if not exists (select 1 from prison_private.indexer_auth where
    encode(extensions.hmac(convert_to(p_timestamp::text || ':' || p_nonce, 'UTF8'), token_hash, 'sha256'), 'hex') = p_signature)
    then return false; end if;
  delete from prison_private.indexer_nonces where used_at < now() - interval '5 minutes';
  insert into prison_private.indexer_nonces(nonce) values (p_nonce)
    on conflict do nothing returning true into accepted;
  return coalesce(accepted, false);
end $$;
revoke all on function public.prison_authorize_indexer(bigint,text,text) from public, anon, authenticated;
grant execute on function public.prison_authorize_indexer(bigint,text,text) to service_role;

-- Retire the credential used by the initial shared-header implementation.
do $$
declare token text; secret_id uuid;
begin
  select id into strict secret_id from vault.secrets where name = 'prison_indexer_token';
  token := encode(extensions.gen_random_bytes(32), 'hex');
  perform vault.update_secret(secret_id, token);
  update prison_private.indexer_auth set token_hash = extensions.digest(token, 'sha256') where singleton;
end $$;

select cron.schedule('forgotten-prison-index', '* * * * *', $job$
  with payload as (
    select extract(epoch from now())::bigint as ts,
      encode(extensions.gen_random_bytes(16), 'hex') as nonce
  )
  select net.http_post(
    url := 'https://sgypzehngyhcdvtwlwst.supabase.co/functions/v1/prison-indexer',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-prison-timestamp', ts::text,
      'x-prison-nonce', nonce,
      'x-prison-signature', encode(extensions.hmac(
        convert_to(ts::text || ':' || nonce, 'UTF8'),
        (select extensions.digest(decrypted_secret, 'sha256') from vault.decrypted_secrets
          where name = 'prison_indexer_token'), 'sha256'), 'hex')),
    body := '{}'::jsonb, timeout_milliseconds := 120000
  ) from payload;
$job$);
