create extension if not exists pg_cron;
create extension if not exists pg_net;

-- This job reads Ethereum and updates the index only. It does not start/finalize
-- draws, sign transactions, or spend ETH. Credentials remain in Supabase Vault.
select cron.schedule('forgotten-prison-index', '* * * * *', $job$
  select net.http_post(
    url := 'https://sgypzehngyhcdvtwlwst.supabase.co/functions/v1/prison-indexer',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-prison-indexer-token', (select decrypted_secret from vault.decrypted_secrets
        where name = 'prison_indexer_token')),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
