# Forgotten Prison

Standalone Forge MVP for Ethereum mainnet: one mystery ERC721 goes to the highest
funded standing bid each day, from a shared warrior/wizard pool. Each winner also has
a 50% chance of an Imp Box while eligible stock remains. Losers roll over indefinitely.
Only the winner pays. Anyone can donate, sync plain NFT transfers, and return won assets.
No frontend integration or onchain deployment is included in this change.

Read [ethskills](https://ethskills.com/SKILL.md) before changing Solidity or deploying.
The design follows its security, testing, shipping, and CROPS guidance.

## Build and test

Use Foundry v1.8.7 (the tested and CI-pinned version), Python 3.9+, and Bulloak 0.8.1.
Install Foundry from its official distribution. In this directory:

```sh
make deps
cargo install bulloak --version '=0.8.1' --locked --root .tools
make check
```

`make deps` downloads Solidity source archives pinned by version and SHA-256 in
`dependencies.lock.json`. `lib/` is ignored; no Git submodules or website Node
dependencies are needed. Dependency licenses remain in their installed directories.

Bulloak `.tree` specifications live beside the implemented unit tests in `test/unit/`.
To scaffold a new test, write its tree, then run:

```sh
.tools/bin/bulloak scaffold -w -m test/unit/NewFeature.tree
# Implement every generated test body and inherit PrisonTestBase as appropriate.
.tools/bin/bulloak check -m 'test/unit/*.tree'
```

Do not force-scaffold over implemented tests. Bulloak checks structure, not assertions.
`make check` also checks Solidity formatting, runs unit, fuzz, and handler invariant tests,
and verifies the committed gas snapshots.
The separate fuzz suite explores bid/accounting amounts and VRF configuration boundaries.
Additional bid-book fuzzing checks FIFO ties, top-ups, arbitrary cancellations, and
amounts above 160 bits against independent expected ordering.
The invariant suite compares the bid book to a linear reference model and checks ETH and NFT
conservation across deposits, cancellations, daily draws, claims, withdrawals, and shutdown.
The inventory model also tracks exact frozen draws, first-accepted randomness, historical
claims, and ETH through safe/plain transfers, syncing, repeated awards, and terminal recovery.
Separate continuing-auction and shutdown campaigns prevent early closure from dominating
all exploration. Lifecycle fuzz cases guarantee multi-round progress and repeated claims.
See the invariant properties and reproduction commands below.

```sh
MAINNET_RPC_URL=https://YOUR_ARCHIVE_ETHEREUM_RPC make fork
make coverage
```

The fork is pinned to Ethereum block **26,327,000**. It creates/funds a subscription
and submits a request to the real Chainlink V2.5 coordinator in local fork state.
It verifies the coordinator stored the request commitment. Callback ABI/authentication
is then exercised with coordinator impersonation: this does **not** test a live
oracle's proof generation, fulfillment service, or production liveness. No RPC writes
are broadcast. The fork command deliberately fails without an RPC instead of silently
skipping integration coverage. A second fork test exercises the actual Warriors, Wizards,
and Imp Box contracts: ERC721 identity, safe/plain transfers, syncing, both prize claims,
and returning a previously claimed asset. These NFT holders are impersonated only in
local fork state. CI runs the offline suites; run the forks explicitly.

## Fuzzing and invariants

The three stateful campaigns target funded handlers with `fail_on_revert = true`.
Expected negative calls are checked inside the handler; an unexpected revert fails
the campaign. Unsupported actions may return early, so call counts alone are not
evidence of successful transitions.

| Property | Independent check |
| --- | --- |
| ETH conservation and withdrawal authority | Each actor's standing bid/refund and owner earnings match ghost balances. Contract ETH equals bids + pending payment + proceeds + refunds + forced surplus. Failed cancellations roll back; nonowners and withdrawals beyond earned proceeds fail. |
| Correct winner and immutable price | A linear eight-actor model determines the maximum bid and FIFO tie priority. Every historical winner and price remain equal to the values locked at request time. |
| Frozen selection domain | Registration timestamps determine eligible membership/counts. The public ordered prefixes are captured before the request and must stay identical while it is pending, including through donations, sync, and returns. |
| First response and exact prizes | The handler records the first valid supplied pair of words independently of contract storage. Exact main and bonus assets are calculated from those words and captured prefixes. Wrong-ID, malformed, unauthorized, duplicate, and stale responses cannot replace them. |
| Exclusive reservations and permanent claims | Every collection/token pair has one modeled owner/state and at most one outstanding reservation. Every historical claim flag stays consumed across later returns and awards. Stale claims, duplicate sync, and owner recovery of reserved prizes fail. |
| Bonus independence | Award a box exactly when frozen box stock exists and the independent coin bit wins. Both words are fuzzed across uint256, and the separate VRF fuzz test flips only the bonus bit while holding the main result fixed. No statistical exactly-50% assertion is used. |
| Monotonic lifecycle and exits | The model independently advances deadlines and Requested/Ready/Finalized/Aborted states. Ready draws cannot time out into refunds. Closure is permanent; late callbacks cannot revive it. |
| Transfer rollback and reentrancy | Rejected NFT claims preserve the complete model; a reentrant NFT receiver must get the exact guard error. Main/bonus claims remain independent. |

The inventory model reads request-time pool order because that order defines the
selection domain; it does not duplicate the swap-and-pop algorithm. Eligibility is
checked separately from that order. Expected random words, prices, statuses, owners,
awards, and claim flags are never copied from the contract's resulting draw record.

After each generated sequence, teardown must finalize a ready draw or time out an
unfulfilled request, return all bidder credits, withdraw only earned proceeds, and
consume remaining claims. The inventory campaigns additionally sync raw gifts and
recover all unassigned stock. Only modeled forced ETH may remain. These are bounded
exit checks over the fixture, not a proof of production oracle availability.

Successful-action counters reset after setup and are logged before teardown; they
describe the reported sequence, not aggregate campaign coverage. The three lifecycle
fuzz tests start without seeded sales and require actual transitions: late donations
and duplicate responses during a second draw, 2-6 consecutive awards of the same
wizard/box with all old claims tested, and requested-versus-ready timeout behavior.
This keeps progress checks from being satisfied by setup alone.

```sh
make fuzz       # 512 cases per fuzz test; 128 invariant runs at depth 128.
make fuzz-deep  # 2,048 cases per fuzz test; 256 invariant runs at depth 256.
make fuzz-deep FUZZ_SEED=0x1234  # Explore another reproducible random stream.
make fuzz-mutants              # Check that three deliberately faulty copies fail.
```

Both fuzz targets default to seed `0xf012`; normal `make check` retains Foundry's
default seed selection. The mutation command uses temporary copies and verifies
assertion failures for VRF overwrites, incorrect selection indices, and reopened
historical claims. It does not edit production sources. Detailed mutant logs and
results are written under ignored `.tools/`.

Validated with seed `0xf012`: all 12 fuzz properties passed 2,048 cases each
(24,576 total); all three invariant campaigns passed 256 runs at depth 256
(196,608 handler calls, zero unexpected reverts). All three deliberate mutants were
rejected by assertion failures. `make check` passed all 107 local tests, including
the unchanged gas snapshots; both pinned mainnet fork tests and `pnpm type-check`
also passed. Production Solidity was unchanged by this test expansion.

## Gas optimization checklist

The measured baseline is production source at `debe41a`, using the same `GasTest`
fixtures as the optimized build. Both use Foundry 1.8.7, Solidity 0.8.30, Cancun,
200 optimizer runs, and isolated external calls. The optimized build enables IR.
Raw results are in [benchmarks/baseline.json](benchmarks/baseline.json) and
[snapshots/Gas.json](snapshots/Gas.json).

- [x] Measure funded success paths before changing code: 21 snapshots cover new/tied
  bids, top-ups, cancellation, a book with 128 prices, donations/sync, VRF, settlement,
  both claims, withdrawals, queued inventory, and terminal recovery.
- [x] Remove redundant storage: FIFO queue order already determines tie priority,
  so bid entries no longer store a sequence. The global sequence and `BidPlaced`
  event remain unchanged. Amounts retain all 256 bits.
- [x] Use transient storage for the reentrancy lock: pinned OpenZeppelin
  `ReentrancyGuardTransient` retains the same guarded entry points and error selector.
  Deployment requires EIP-1153 support, available on the intended Ethereum mainnet
  target. Guard cleanup permits sequential calls within a transaction.
- [x] Reuse already-known inventory indices: finalization passes its selected main
  and bonus indices directly to removal. Recovery still looks up the position.
  Mapping deletion and eligible-prefix repair remain intact.
- [x] Compare compiler settings: IR at 200 runs reduces runtime bytecode from
  **14,457 to 13,153 bytes (9.0%)**. Against optimized legacy codegen, some paths
  increase by less than 1%; all measured paths still improve over the original
  baseline. Legacy codegen at 1,000 runs was also measured and did not improve
  these call snapshots, so the optimizer-run setting remains 200.
- [x] Keep configuration immutable and use constants/custom errors: already in
  place. External transfer data remains calldata; memory copies are bounded structs.
- [x] Check storage packing and numeric bounds: preserve the public `Draw` tuple
  layout and full-width ETH amounts/token IDs. No new narrowing casts or artificial
  bid, token-ID, or inventory limits were introduced to pack slots.
- [x] Keep operations bounded: Solady price operations remain O(log distinct prices),
  FIFO updates and inventory removal O(1), and the VRF callback has no asset transfers
  or inventory loops. No scans of bidders or inventory were introduced.
- [x] Preserve checked arithmetic, custody checks, receiver acceptance, independent
  claims, reentrancy protection, and separate ETH liabilities. No manual assembly
  or unchecked arithmetic was added for marginal gas savings.
- [x] Gate regressions: Bulloak specifies the benchmark scenarios; `make check`
  checks their snapshots in CI. Regular tests do not overwrite the recorded values.

Representative isolated-call snapshots (gas units):

| Operation | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| First bid | 216,600 | 192,068 | 11.3% |
| New distinct bid price | 170,869 | 146,365 | 14.3% |
| Bid at an existing tied price | 142,100 | 117,703 | 17.2% |
| Top up into a tie | 122,453 | 114,276 | 6.7% |
| Cancel the head of a tied queue | 60,823 | 52,621 | 13.5% |
| Start with two bidders | 454,413 | 450,645 | 0.8% |
| Finalize with a bonus | 197,039 | 194,373 | 1.4% |
| Claim main prize | 85,218 | 82,362 | 3.4% |
| Withdraw proceeds | 35,750 | 33,893 | 5.2% |
| Withdraw refund | 36,840 | 33,293 | 9.6% |

Snapshots capture only the selected call, excluding fixture setup. Donation and
callback measurements include their mock NFT/coordinator wrapper calls. They compare
contract changes; they are not live mainnet fee quotes or estimates of Chainlink
subscription fees. The public contract ABI and event definitions are unchanged.
The internal bid storage layout changes; this is a new-deployment contract, not a
storage-compatible upgrade.

Validation at gas optimization commit `be38c45`: all 103 local tests and both pinned mainnet fork tests
passed, as did the repository TypeScript check. Both handler invariant campaigns
completed 128 runs at depth 128 with zero unexpected reverts. The generated contract
ABI matches the baseline exactly. Slither 0.11.4 returned the same 11 detector warnings
as the baseline, with no new detector findings; dispositions are documented below.

```sh
make gas-check  # Compare with committed snapshots without rewriting them.
make gas        # Explicitly regenerate snapshots after reviewing a change.
```

References: [ethskills gas guidance](https://ethskills.com/gas/SKILL.md),
[OpenZeppelin transient guard](https://docs.openzeppelin.com/contracts/5.x/api/utils#ReentrancyGuardTransient),
and [Solidity storage layout](https://docs.soliditylang.org/en/v0.8.30/internals/layout_in_storage.html).

## Auction rules

- Three distinct immutable ERC721 collections: Warriors and Wizards share the main
  pool; Imp Boxes form the bonus pool. Assets are identified by `(collection, tokenId)`;
  the same token ID in different collections is distinct, and ID zero is supported.
- Anyone can send a supported NFT using its collection's `safeTransferFrom`.
  `onERC721Received` registers it automatically; no prior auction approval or separate
  deposit call is needed. For a plain `transferFrom`, anyone calls
  `syncReceivedNFT(collection, tokenId)` afterward. The contract verifies ownership and
  rejects duplicate registration or re-registration of an unclaimed assigned prize.
- Donations are gifts to the prize inventory, with no donor refund or withdrawal right.
  The three wizards are an initial funding quantity, not a lifetime cap: additional
  warriors, wizards and boxes from the configured collections can be donated anytime.
- Every available main-pool NFT has one equally weighted entry. Wizards replace the
  warrior prize when selected. A bonus is additional to either type of main prize.
- `bid()` accepts native ETH. Sending more ETH increases the sender's existing bid;
  it does not replace it or require paying the full amount again.
- Equal amounts prefer the bid that reached that amount earlier. Increasing a bid
  assigns a new sequence. Cancelling and rebidding also loses the old priority.
- Distinct bid amounts are ordered by Solady's `RedBlackTreeLib` (pinned v0.1.26).
  `BidBook` adds an indexed FIFO queue per amount for ties and arbitrary cancellation.
  Adding/removing a price level costs O(log distinct prices); queue updates are O(1).
  Highest-price lookup is O(log distinct prices). No custom tree/heap balancing,
  narrowed amount types, packed composite keys, or lazy deletion are used.
- Standing bids have **no expiry**, no daily charge, and no automatic growth.
  Winning removes the whole bid and charges exactly that amount. A winner may bid
  again using a new deposit for a later round.
- `cancelBid(to)` withdraws the entire active bid; partial reductions are outside
  the MVP. Every active bid freezes at `nextDrawAt`, including the leader's bid.
  After the winner is locked, the losing bids can be cancelled until the next cutoff.
- Anyone can call `startDailyDraw()` at or after the deadline. It locks the highest
  bidder, price, and the inventory registered before that cutoff, before requesting VRF.
  The caller supplies no winner, token, or seed. Only one request may be pending.
- First cutoff is deployment time + 24 hours. Each successful start sets the next
  cutoff to **start transaction time + 24 hours**. This is a minimum interval,
  not a fixed UTC calendar schedule. Late calls drift; missed days do not create
  catch-up draws. Empty days advance the deadline without charging anyone or
  requesting randomness. No reserve price or last-minute bidding extension.
- The VRF callback stores the first matching two-word result only. Anyone then calls
  `finalizeDraw()` to select `randomWord % frozenInventorySize`, reserve that NFT,
  and recognize the sale proceeds. The second word's low bit is a 50% coin flip:
  an even value awards a box when the frozen bonus inventory is nonempty. Its remaining
  bits select the box, `(bonusWord >> 1) % frozenBoxInventorySize`. No second VRF request.
- Both prizes leave available stock when awarded, even if the winner waits to claim.
  Exhausted bonus stock never blocks the main prize; replenishment enables later bonuses.
  Prize selection uses modulo reduction (negligible finite-word bias for non-power-of-two
  pool sizes); the binary bonus roll itself is exactly 50% under uniform VRF output.
- `claimNFT(drawId, to)` and `claimBonus(drawId, to)` are separate winner-only claims.
  An incompatible recipient cannot block settlement or the other prize; retry to another
  address. Proceeds do not depend on either claim being executed.
- After claiming, anyone who owns the NFT can send it back. It becomes a new available
  entry on receipt/sync, while historical draw claim flags remain consumed. It cannot
  be awarded twice simultaneously; returning it does permit winning it in a later draw.
- Deposits/syncs before `nextDrawAt` qualify for the upcoming round. At or after the
  cutoff they are queued for the subsequent round. Registration time, not an earlier
  plain transfer's timestamp, determines eligibility. A pending draw's two snapshot
  sizes never change; arrivals during the request cannot change its prize or bonus.
  They qualify for the next round if registered before that next round's cutoff.
- Queue promotion and inventory removal take O(1) work, regardless of the number of
  donations. Eligible assets occupy a prefix; removal preserves that prefix when queued
  assets exist. While a draw is pending, arrays only receive appends beyond its frozen
  prefix; no existing entry moves until finalization.
  A day with only queued main prizes is skipped, promoting them for the following day.
- The owner cannot remove available prizes while open. Inventory, donations and bids
  are public; only the eventual prize selection is unknown before randomness arrives.

## ETH accounting and oracle configuration

All amounts are wei. ETH is separated into:

```text
accounted ETH = totalBidEscrow + pendingPayments + proceeds + totalRefunds
```

The contract balance equals accounted ETH during normal operation. ETH forcibly
sent to the contract can create a surplus, never extra owner proceeds. There is no
generic owner ETH sweep. `withdrawProceeds(to, amount)` can spend only finalized
sales and does not wait for NFT claims. All ETH exits use checks-effects-interactions
and a reentrancy guard; failed transfers restore the credit.

Chainlink **V2.5 subscription requests**, two random words per nonempty day, with
native payment in the deployment script. VRF fees are paid from a separately
funded subscription, never from bidder deposits. No quoted fiat cost is assumed.
The coordinator, subscription ID, key hash, payment mode, confirmation count, and
callback gas limit are fixed at deployment. The script uses 10 confirmations and
150,000 callback gas; confirm these against expected prize values and current
network configuration before deployment.

The contract intentionally uses Chainlink's `VRFConsumerBaseV2` **only for immutable
callback authentication**. V2.5 uses the same `rawFulfillRandomWords` ABI. Requests
use `IVRFCoordinatorV2Plus` and `VRFV2PlusClient`; no deprecated V2 coordinator or
request API is used. Unlike `VRFConsumerBaseV2Plus`, the chosen base does not let
an owner swap the coordinator for an address that fabricates randomness. It also
means coordinator migration requires a new deployment.

## Failure exit

`shutdownStalledAuction()` is permissionless after seven days without a request
being fulfilled, or seven days after an unstarted cutoff. It **permanently closes**
the deployment. It never rerolls or restarts a round. This is a stalled-auction
timeout, not a bid expiry.

For an unfulfilled locked draw, its price becomes a winner-owned refund withdrawable
through `withdrawRefund(to)`. All standing bids become cancellable. Late callbacks
are ignored. If randomness has already arrived, shutdown cannot cancel that draw;
anyone must finalize it instead. Owner recovery of unsold NFTs is available only
after terminal shutdown, and cannot touch assigned main or bonus prizes. This recovery
also applies to inventory donated by third parties; donors have no refund entitlement.
Safe transfers are rejected after shutdown. A supported NFT sent by plain transfer can
still be synced after closure solely to make it recoverable as unsold stock; this never
reopens the auction. Previously finalized proceeds and both claims remain valid. A transaction race at the timeout can
decide whether a late oracle fulfillment or terminal shutdown takes effect first.

## State transitions and callers

| Transition | Caller / incentive | If nobody calls |
| --- | --- | --- |
| Collection `safeTransferFrom(from,prison,id)` | Any NFT holder donates a prize; callback registers it | No new inventory |
| `syncReceivedNFT(collection,id)` | Anyone registers a plain transfer so it can be awarded | NFT remains unregistered and excluded from draws |
| `bid()` | Bidder wants a mystery NFT | Existing offers remain |
| `cancelBid(to)` | Bidder wants their active ETH back | Offer remains active indefinitely |
| `startDailyDraw()` | Owner/automation expects proceeds; winner wants prize | Bids freeze at cutoff; terminal exit after seven days |
| VRF callback | Chainlink fulfillment, paid by subscription | Pending payment remains locked; terminal exit after seven days |
| `finalizeDraw()` | Owner wants proceeds or winner wants assigned NFT | Ready draw waits; anyone can finalize |
| `claimNFT(id,to)` / `claimBonus(id,to)` | Winner wants their main prize / box | Each unclaimed prize stays reserved |
| `withdrawProceeds(to,amount)` | Owner wants earned ETH | Proceeds stay credited |
| `shutdownStalledAuction()` | Participant wants an exit from a stalled auction | Locks persist until someone calls |
| `withdrawRefund(to)` | Aborted winner wants their ETH | Refund stays credited |
| `recoverUnsoldNFT(collection,id,to)` | Owner recovers unassigned stock after closure | NFTs remain in contract |

There is no keeper bounty. Permissionless access is the fallback, and owner revenue
or winner receipt is the direct incentive. An owner-operated bot is operationally
useful but has no special contract privilege.

## CROPS review

Chosen default: one nonupgradeable Ethereum mainnet contract, funded ETH bids,
escrowed ERC721s, immutable oracle settings, and permissionless settlement. Mainnet
is the user's selected network and keeps NFT custody and auction settlement together.
Only transfers, ordering needed for settlement, commitments, and accounting are
onchain; any future browsing UI and historical ranking should derive from events.

| Property | Concrete compromise, mitigation, and escape |
| --- | --- |
| Censorship resistance | Owner cannot block settlement, choose winners, pause withdrawals, or upgrade code. Subscription manager/Chainlink can interrupt randomness; seven-day terminal exit returns bidder funds. Call directly with any RPC; no hosted backend is required. |
| Open | Sources, ABI generation (`forge build`), dependency pins, tests, and deployment script are in this directory. No UI/indexer is required for contract access. |
| Free | Project code is MIT; installed dependencies retain their upstream licenses. Anyone can fork and operate this contract. |
| Privacy | Wallets, bids, inventory, winners, payments and timing are public. RPC providers see requests and connection metadata. No identity data is collected here; use a chosen RPC and avoid linking wallets unnecessarily. |
| Security | Anyone can donate supported assets; owner controls finalized proceeds and unsold recovery after terminal closure only; use a Safe. No proxy, arbitrary calls, coordinator replacement, admin rerolls or sweep of bidder ETH. Prize collection behavior and oracle availability remain external dependencies. Cancellation, claims and terminal refunds provide direct exits. |

Accepted limitations: public bidding permits transaction ordering/sniping near the
deadline; any donor can change upcoming prize odds by adding genuine supported NFTs
before cutoff (including the warrior/wizard mix); a stalled oracle can terminate
the deployment; no keeper reward or fixed calendar schedule. The three ERC721 collections
must be trusted to honor custody/transfers (a collection admin's confiscation or pause
could defeat delivery). Supported plain NFT transfers can be synced. Unsupported
collections and forced ETH have no rescue path; only the three configured collections are accepted by the receiver.
This is an MVP with tests and implementation review, not an independent security audit.

### Static analysis

Slither 0.11.4 was run against production sources with dependency/test/script findings
filtered out. Reviewed detector results:

- `arbitrary-send-eth` (high): intentional recipient-directed withdrawals through
  private `_sendETH`. The only callers debit the sender's own bid/refund or enforce
  owner-only, proceeds-bounded withdrawal before the call. Tested with unauthorized,
  rejecting and reentrant recipients; no arbitrary caller can spend another user's ETH.
- `reentrancy-no-eth` (medium): all asset/auction mutation
  entrypoints, including the NFT receiver and sync, have OpenZeppelin's shared reentrancy
  guard. Claims/recovery call ERC721, and the request ID must be recorded after the
  coordinator returns it.
  The only unguarded mutation path is an authenticated VRF callback from the immutable
  trusted coordinator, which fulfills asynchronously. Reentrant NFT recipients
  (asserting the guard error), reentrant ETH recipients and wrong-caller callbacks
  are regression tested.
- `timestamp` / `low-level-calls`: explicit daily/terminal deadlines and checked ETH
  calls are intended. No timestamp is used for randomness.

Permissionless daily settlement and inventory registration do not loop over bidders
or inventory. These are documented detector dispositions, not a claim of a finding-free audit.
Reproduce using an isolated virtual environment:

```sh
python3 -m venv .tools/slither-venv
.tools/slither-venv/bin/pip install 'slither-analyzer==0.11.4'
VIRTUAL_ENV="$PWD/.tools/slither-venv" .tools/slither-venv/bin/slither . --filter-paths 'lib/|test/|script/' --exclude-dependencies
```

## Mainnet deployment runbook (not executed)

Use the intended production Safe as `PRISON_OWNER`; do not leave proceeds authority
on a temporary deployer. No private key belongs in `.env` or Git. Use an encrypted
Foundry keystore or hardware signer. All commands below are run from this directory.

1. Copy `.env.example` to `.env`, set the RPC, intended Safe and subscription ID,
   and verify all three collection addresses. Then `set -a; . ./.env; set +a`.
2. Re-check coordinator and key hash against the
   [official mainnet deployment list](https://docs.chain.link/vrf/v2-5/supported-networks#ethereum-mainnet).
   The documented coordinator was checked for bytecode and a valid `s_config()` on
   block 26,327,000 during development. Re-check all three collections' ERC721 identities,
   the Safe owners/threshold, and current coordinator settings before using funds:

```sh
cast chain-id --rpc-url "$MAINNET_RPC_URL" # must be 1
for collection in "$WARRIOR_COLLECTION" "$WIZARD_COLLECTION" "$IMP_BOX_COLLECTION"; do
  cast code "$collection" --rpc-url "$MAINNET_RPC_URL"
  cast call "$collection" 'name()(string)' --rpc-url "$MAINNET_RPC_URL"
  cast call "$collection" 'supportsInterface(bytes4)(bool)' 0x80ac58cd --rpc-url "$MAINNET_RPC_URL"
done
cast code "$VRF_COORDINATOR" --rpc-url "$MAINNET_RPC_URL"
cast call "$VRF_COORDINATOR" 's_provingKeys(bytes32)(bool,uint64)' "$VRF_KEY_HASH" --rpc-url "$MAINNET_RPC_URL"
cast call "$VRF_COORDINATOR" 'getSubscription(uint256)(uint96,uint96,uint64,address,address[])' "$VRF_SUBSCRIPTION_ID" --rpc-url "$MAINNET_RPC_URL"
make check
make fork
forge script script/DeployForgottenPrison.s.sol:DeployForgottenPrison --rpc-url "$MAINNET_RPC_URL" --account prison-deployer
```

3. The last command is a **dry run**. After reviewing its constructor configuration,
   balances, owner, and simulation, explicit deployment uses:

```sh
forge script script/DeployForgottenPrison.s.sol:DeployForgottenPrison --rpc-url "$MAINNET_RPC_URL" --account prison-deployer --broadcast --verify --etherscan-api-key "$ETHERSCAN_API_KEY"
```

4. Record the deployed address and transaction, verify source on Etherscan and
   Sourcify, and check `owner()` equals the intended Safe. For standalone verification:

```sh
export PRISON_ADDRESS=0xYOUR_DEPLOYED_CONTRACT
forge verify-contract "$PRISON_ADDRESS" src/ForgottenPrison.sol:ForgottenPrison --chain 1 --guess-constructor-args --watch --etherscan-api-key "$ETHERSCAN_API_KEY"
forge verify-contract "$PRISON_ADDRESS" src/ForgottenPrison.sol:ForgottenPrison --chain 1 --verifier sourcify --guess-constructor-args --watch
cast call "$PRISON_ADDRESS" 'owner()(address)' --rpc-url "$MAINNET_RPC_URL"
```

5. The subscription owner must register `PRISON_ADDRESS` using
   `addConsumer(subscriptionId, consumer)` and fund the native balance separately.
   Keep enough buffer for VRF fulfillment and ensure the subscription manager is
   the intended multisig. Any holder can fund inventory by calling the appropriate
   collection's `safeTransferFrom(holder, PRISON_ADDRESS, tokenId)`. Use the selected
   initial warriors, the three actual wizard IDs, and actual box IDs; token IDs below
   are shell variables you fill, not guessed prize IDs. No auction-wide approval is
   necessary when the holder submits the transfer directly.

```sh
cast send "$WARRIOR_COLLECTION" 'safeTransferFrom(address,address,uint256)' "$DONOR_ADDRESS" "$PRISON_ADDRESS" "$WARRIOR_TOKEN_ID" --rpc-url "$MAINNET_RPC_URL" --account prison-donor
# Repeat on WIZARD_COLLECTION / IMP_BOX_COLLECTION for each intended token ID.
# Only for a token already sent using plain transferFrom (any caller may sync):
cast send "$PRISON_ADDRESS" 'syncReceivedNFT(address,uint256)' "$ASSET_COLLECTION" "$ASSET_TOKEN_ID" --rpc-url "$MAINNET_RPC_URL" --account prison-donor
```

6. Perform a deliberately small end-to-end live check: submit a funded bid, wait
   the full day, call `startDailyDraw()`, observe the real VRF callback, call
   `finalizeDraw()`, claim the main NFT and any awarded box separately, and withdraw
   exactly that sale's proceeds. Confirm the box result is recorded even when no box
   is won. Check an additional losing bid can roll over and be cancelled. Do not use
   time-travel, impersonation, or fabricated randomness for this production verification.

No deployment, subscription creation/funding, or NFT/ETH transfer has been broadcast
as part of implementing this project. The production multisig and subscription must
be selected and all deployment addresses re-verified before production. Collection names, bytecode presence and ERC721 support
were checked at block 26,327,000; the fork tests use these deployments:

| Collection | Ethereum mainnet address |
| --- | --- |
| Warriors | [0x9690b63Eb85467BE5267A3603f770589Ab12Dc95](https://etherscan.io/address/0x9690b63eb85467be5267a3603f770589ab12dc95#code) |
| Wizards | [0x521f9C7505005CFA19A8E5786a9c3c9c9F5e6f42](https://etherscan.io/address/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42#code) |
| Imp Boxes | [0x59775fD5F266C216D7566eB216153aB8863C9c84](https://etherscan.io/address/0x59775fd5f266c216d7566eb216153ab8863c9c84#code) |
