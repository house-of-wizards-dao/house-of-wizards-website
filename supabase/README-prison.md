# Forgotten Prison event index

The `house-of-wizards` Supabase project (`sgypzehngyhcdvtwlwst`) indexes Ethereum
contract `0x7a258A7ed776d88Ec7E19a03019a632c4F097EF8`, from deployment block
`26428270`. The deployed Edge Function is `prison-indexer`; the cron job is
`forgotten-prison-index` and runs once per minute.

This is **read-only on Ethereum**. It has no signer, sends no transactions, and
does not automate `startDailyDraw` or `finalizeDraw`. RPC reads consume no gas.

## Data and pages

- `prison_events`: canonical decoded logs, block hashes, timestamps and transaction links.
- `prison_index_state`: atomic checkpoint, revision and current contract snapshot.
- `prison_bids`: current standing bids, ordered by wei amount then sequence. An
  increase replaces both the total and tie priority. A winning payment leaves
  this book at `DrawStarted`; a fresh bid by that winner is independent.
- `prison_draws`: requested / ready / finalized / aborted rounds, winning ETH,
  NFT and Imp Box IDs, independent claims, receiving addresses and transactions.
- `prison_read_index`: coherent JSON response, exact decimal strings for wei and
  token IDs, top 50 bids and 20 rounds per history page. Skipped empty days do not
  create winning rounds. Aborted payments are excluded from winning totals.

`GET /api/forgotten-prison/index?page=0` reads these projections using the existing
server-only Supabase environment variables. The bidding page uses them for its
leaderboard; `/magic/forgotten-prison/history` provides the complete paginated
trail. The countdown and wallet actions still check current on-chain state.
Cutoff reached, randomness requested, randomness received and prize awarded are
shown separately. Claims remain available through the existing wallet flow.

Client reads refresh every 15 seconds; mainnet indexing runs every minute. The
last successful sync is displayed, with a delayed-data notice after three
minutes. Results near the head are provisional and can change in a reorg.
During initial/deep-reorg backfill, the API waits for a complete current snapshot.

The development fork uses its own read-only log projection when
`FORGOTTEN_PRISON_LOCAL_ENABLED=1`. Its chain ID and address are validated, and
local/test events are never written to the mainnet database.

## Operation and recovery

The function defaults to `https://ethereum-rpc.publicnode.com`. An optional
`PRISON_RPC_URL` **Edge Function secret** can override it. No new website secret
is needed. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the
function. Keep service credentials out of `NEXT_PUBLIC_*` variables.

Gateway JWT verification is disabled; the function instead requires an HMAC
signature over a timestamp and random nonce. Postgres verifies the signature,
rejects requests older than two minutes, and consumes the nonce atomically so a
request can run only once. The persistent secret remains in Vault under
`prison_indexer_token`; a derived signing key is in the unexposed
`prison_private` schema. Queued HTTP requests contain only short-lived signatures,
never the persistent secret. This avoids relying on the managed `pg_net` queue's
public grants, which the project role cannot reliably revoke. Public clients
cannot write index rows or call the commit/auth functions. Public blockchain
tables have read-only RLS policies.

Each scan covers at most 2,000 blocks, rereads a 64-block overlap, and checks the
cursor's hash. A changed cursor hash triggers a bounded replay from deployment.
The end-block hash is checked again before committing. Events and the snapshot
are committed atomically with a revision comparison, so concurrent cron runs
cannot overwrite newer work. Replayed ranges replace old logs and remove
orphaned events. Failures preserve the last committed checkpoint and retry on
the next invocation. Historical backfills read logs only; contract storage is
read at the current head so a paid archive endpoint is not required.

Useful read-only checks in Supabase SQL Editor:

```sql
select cursor_block, head_block, indexed_at, revision, snapshot
from public.prison_index_state;

select jobname, schedule, active from cron.job
where jobname = 'forgotten-prison-index';

select id, status_code, error_msg, content from net._http_response
order by id desc limit 10;
```

To trigger the configured job once without exposing its signing key:

```sql
do $$
declare job_command text;
begin
  select command into strict job_command from cron.job
    where jobname = 'forgotten-prison-index';
  execute job_command;
end $$;
```

To pause indexing, set this cron job's `active` flag to false using the Cron
dashboard or `cron.alter_job`; existing history stays available. Resume the job
to backfill. Do not delete the checkpoint to retry a failed RPC request.

## Source and validation

Migrations in this directory create the schema, Vault credential, cron job, and
networking extension. They are already applied to the project above. The
function source is in `functions/prison-indexer/`. Regenerate both website and
indexer ABI copies with `node scripts/generate-prison-abi.mjs` after rebuilding
the contract artifact. Deploy the indexer with its `deno.json` import map and
`_shared/abi.ts` dependency.

`tests/forgotten_prison_index.sql` exercises real Postgres projections, exact wei,
tie ordering, cancellation, fresh bids, all draw stages, independent claims,
aborts, pagination, retry idempotency, concurrent revision rejection, reorg
rollback, write permissions, signature expiry and replay prevention. Its synthetic rows are enclosed in a rolled-back
transaction and never appear to other sessions. Application tests:

```sh
pnpm test --runInBand src/lib/forgotten-prison/event-projection.test.ts src/app/magic/forgotten-prison/indexed-auction.test.tsx
pnpm type-check
```
