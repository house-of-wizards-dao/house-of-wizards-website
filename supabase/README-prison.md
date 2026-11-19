# Forgotten Prison event index

The `house-of-wizards` Supabase project (`sgypzehngyhcdvtwlwst`) indexes Ethereum
contract `0x7a258A7ed776d88Ec7E19a03019a632c4F097EF8`, from deployment block
`26428270`. The deployed Edge Function is `prison-indexer`; the cron job is
`forgotten-prison-index` and runs once per minute.

The **indexer is read-only on Ethereum**. It has no signer and sends no transactions.
RPC reads consume no gas. The separate, initially paused `prison-keeper` function
below handles draw transactions when explicitly enabled.

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

The hosted indexer uses the Alchemy Ethereum Mainnet URL supplied in that
Supabase secret. Setting `PRISON_RPC_URL` in Vercel does not configure the Edge
Function. PublicNode can reject older logs without a personal token, so use an
endpoint that permits historical event reads for recovery.

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

Each scan covers at most 2,000 **new** blocks and checks the cursor's hash instead
of downloading an overlapping range on every tick. A changed cursor hash triggers
a bounded replay from deployment. An unchanged head needs no log or snapshot read.
The end-block hash and the original matching checkpoint hash are checked again
before committing, including a reorg that occurs between initial boundary reads.
The seven snapshot fields use one Multicall, with one additional read only when
a draw is pending. Events and the snapshot
are committed atomically with a revision comparison, so concurrent cron runs
cannot overwrite newer work. Replayed ranges replace old logs and remove
orphaned events. Failures preserve the last committed checkpoint and retry on
the next invocation. Historical backfills read logs only; contract storage is
read at the current head so a paid archive endpoint is not required.

If Alchemy advertises a smaller log range (10 blocks on its Free tier), the
reader splits the batch on the same configured endpoint, with bounded concurrency
and pacing. All chunks must succeed before committing; unrelated RPC failures
still preserve the checkpoint. A temporarily stale RPC head cannot trigger a
destructive replay. `node --import tsx --test supabase/tests/indexer-logs.test.ts`
checks range coverage, provider limits, and failure handling. The scan and snapshot
tests cover reorg races, unchanged/stale heads, and actual viem RPC aggregation.

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

## Prize inventory and character metadata

`prison_inventory` projects each Warrior/Wizard's latest canonical lifecycle
event. A deposit makes it `available`; `DrawFinalized` changes it to `awarded`
before claim, followed by `claimed` or `recovered` when appropriate. Returning a
claimed NFT creates a new available entry for the same collection/token identity.
Replay and reorg handling come from the existing atomic event index. A plain
ERC-721 transfer enters the registered pool only after the contract's sync call.

`prison_nft_metadata` stores the name and image URL separately and keeps them
after award or claim. The public page gets both in its existing index response,
including historical prizes. It does not request NFT metadata per card. The
browser still loads the actual image from its stored URL. Metadata is publicly
readable with RLS; only the server role can write it.

After catching up, the indexer fills up to 50 missing characters per run through
the site's bounded `/api/forgotten-prison/characters` catalog endpoint. This uses
the existing local character catalog. Lookup failures retry on the next tick
without stopping event indexing. Already cached characters are not fetched again.
To backfill the existing pool from a checkout with Supabase server credentials:

```sh
node --env-file=.env --env-file=.env.local --import tsx scripts/backfill-prison-metadata.ts --write
```

`tests/forgotten_prison_inventory.sql` exercises lifecycle transitions, returns,
reorg restoration, collection/token identity, cache retention, and RLS within a
rolled-back transaction. `pnpm prison:indexer-check` and
`pnpm prison:metadata-test` validate the indexer and bounded metadata lookup.

## Draw keeper (initially paused)

`prison-keeper` uses the `PRISON_KEEPER_PRIVATE_KEY` Edge Function secret. Add the
key directly in Supabase; never put it in website environment variables, source,
database rows, CLI arguments, or logs. It belongs to a separate gas-only wallet,
not the Ledger owner. Project Edge Functions share access to project secrets.

The deployment creates the `forgotten-prison-keeper` cron with `active=false` and
`prison_private.keeper_state.enabled=false`. Both must be enabled deliberately.
A signed manual invocation while paused derives and reports only the public
address, balance, and proposed next action; it never simulates, signs, or sends.
The first successful check pins the public address in `keeper_state`.

The only allowed transactions are zero-value Ethereum-mainnet calls to
`startDailyDraw()` and `finalizeDraw()` on the fixed deployed contract. The keeper
starts at/after `nextDrawAt + 30 minutes`, including empty days while inventory exists, so new
deposits become eligible and the daily cutoff advances. It waits for VRF status
`Ready` and 30 minutes after the `RandomnessReceived` block timestamp before
finalizing. The callback event comes from the existing event index and its block
hash is checked against the live chain. Missing or reorged event data defers the
call until indexing catches up. Cron checks every minute, so submissions can
occur up to a minute after these thresholds, or later when gas caps intervene.
The bidding page shows these countdowns and lets any wallet call either eligible
step immediately by paying its network fee. Bidding still closes at the original
cutoff; this is not a bidding extension. The next cutoff remains 24 hours after
the actual start transaction, so automatic-only starts drift 30 minutes each day.
It stops creating transactions when the contract is
closed or main inventory is exhausted, and does not perform catch-up rounds.
It never claims prizes, withdraws proceeds, closes the auction, or fulfills VRF.

During quiet periods the keeper reads the existing index first. A complete snapshot
whose sync time and block timestamp are both at most three minutes old can defer
RPC work until one minute before the action is due. Finalization uses the indexed
callback timestamp; it is still verified on-chain before any transaction. Every
15 minutes the keeper bypasses this optimization for a live audit. Missing, stale,
malformed, future-dated, or unavailable index data also falls back to live checks.
Pending transactions, paused wallet verification, and wallet initialization/mismatch
checks always bypass the cache. Deferral can only postpone a check; only the existing
live runner can authorize a transaction. The last known balance is preserved on
deferred runs. Contract reads during live checks are combined using Multicall.

### RPC usage estimate

At a one-minute schedule and roughly five new Ethereum blocks per tick, a normal
index update uses one `eth_getLogs`, one aggregated `eth_call`, four block reads,
and a zero-billed-CU `eth_chainId`. At Alchemy's current method rates this is
166 CU/tick, or **7.17M CU per 30 days**. Fifty bids/day add roughly 0.03M CU for
event timestamps; draw activity, retries and recovery add more. With a healthy
index, an enabled keeper's 15-minute audits are about 0.31M CU/month, plus action,
receipt, and exceptional checks. Budget **8–10M CU/month for the backend** under
normal operation; prolonged index outages, gas-cap retries, and large replays can
increase this. This is a code-derived estimate, not measured account billing.

The website's existing direct RPC reads are unchanged and additional. If they use
the same Alchemy account, each active visitor-hour costs roughly 0.09–0.12M CU at
the current ten-second refresh interval. Other apps on that account also count
toward its quota. References: [Alchemy method costs](https://www.alchemy.com/docs/reference/compute-unit-costs)
and [pricing](https://www.alchemy.com/pricing).

Initial transaction limits (review before enabling):

| Limit | Value |
| --- | --- |
| Maximum fee per gas | 5 gwei |
| Maximum priority fee | 1 gwei |
| Maximum gas limit | 750,000 |
| Maximum worst-case gas cost per transaction | 0.003 ETH |
| Rolling 24-hour worst-case gas budget | 0.01 ETH |
| Receipt confirmation depth | 12 blocks |

These are ceilings, not expected costs. Gas is estimated with a 20% + 10,000
buffer. Fees above the caps defer the call. The rolling budget conservatively
counts each transaction's reserved maximum fee, including failed ones, for 24
hours. Chainlink VRF fees are separate and still come from the VRF subscription.
The keeper wallet must have enough ETH for the maximum fee of the proposed call.

Each invocation uses a three-minute database lease. Before broadcasting, it
persists the signed bytes, nonce, and hash in a private outbox. A timeout or crash
reuses those exact bytes, preventing duplicate spending. The database also
enforces a single outstanding transaction, a unique signer/nonce, the spending
budget, and the enabled switch. Request authentication has its own Vault secret
and a `keeper:v1` HMAC domain, with two-minute expiry and single-use nonces.

The outbox contains broadcastable signed transactions, not private keys. Treat
it as private operational data. Anyone possessing already signed bytes can
broadcast them; pausing stops new keeper submissions but cannot revoke an
already signed or pending Ethereum transaction. A pause racing the RPC send can
still leave the one in-flight transaction. No automatic fee increases occur.

A confirmed revert or unknown consumed nonce disables transactions. A pending
transaction older than 30 minutes, changed intended round, or delayed VRF is
reported for operator attention. No automatic shutdown or cancellation occurs.
Status is recorded in Postgres; notification delivery is not configured.

Read status without reading the private key or signed bytes:

```sql
select enabled,wallet_address,balance_wei,last_checked_at,last_status,last_detail,
  pause_reason from prison_private.keeper_state;
select hash,action,nonce,status,created_at,receipt_block,actual_cost_wei
  from prison_private.keeper_transactions order by created_at desc limit 10;
```

Invoke a paused check (or run one enabled tick) without exposing the signing token:

```sql
do $$ declare job_command text;
begin
  select command into strict job_command from cron.job
    where jobname='forgotten-prison-keeper';
  execute job_command;
end $$;
```

After funding the verified wallet and approving the limits, enable the keeper:

```sql
begin;
update prison_private.keeper_state set enabled=true,pause_reason=null
  where singleton and wallet_address is not null;
select cron.alter_job((select jobid from cron.job
  where jobname='forgotten-prison-keeper'),active:=true);
commit;
```

To pause, set `enabled=false` and alter this cron job to `active:=false`. Keep the
indexer cron running. To rotate the key, pause first, resolve any outstanding
transaction, replace the Edge Function secret, clear `wallet_address`, and run a
paused check to pin the new address before funding/enabling it. Never discard a
pending outbox entry merely because an RPC call timed out. Inspect its hash and
nonce on Ethereum before replacing/cancelling it or changing the outbox.

Validation:

```sh
pnpm prison:keeper-check
pnpm prison:keeper-test
```

`tests/forgotten_prison_keeper.sql` checks private access, HMAC replay/expiry,
exclusive leases, persisted crash recovery, spending caps, pause checks, and
automatic revert shutdown inside a rolled-back transaction, without chain calls.
