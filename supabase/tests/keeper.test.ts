import assert from "node:assert/strict";
import { test } from "node:test";
import { keccak256, parseTransaction, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  callData,
  decide,
  prisonAddress,
  runKeeper,
  validateTransaction,
  type Chain,
  type Pending,
  type Receipt,
  type Settings,
  type Snapshot,
  type Store,
} from "../functions/prison-keeper/runner.ts";

// Public Anvil fixture; never funded or connected to a real RPC.
const account = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
);
const config = (): Settings => ({
  enabled: true,
  walletAddress: account.address.toLowerCase(),
  maxFeeWei: 5_000_000_000n,
  maxPriorityFeeWei: 1_000_000_000n,
  maxGas: 750_000n,
  maxTxCostWei: 3_000_000_000_000_000n,
  max24hCostWei: 10_000_000_000_000_000n,
  pending: null,
});
const snapshot = (): Snapshot => ({
  chainId: 1,
  blockNumber: 100n,
  timestamp: 2000n,
  baseFee: 100_000_000n,
  closed: false,
  available: 355n,
  nextDrawAt: 200n,
  pendingDrawId: 0n,
  pendingStatus: 0,
  requestedAt: 0n,
  readyAt: null,
  balance: 10n ** 18n,
  latestNonce: 0,
  pendingNonce: 0,
});
const fixture = () => {
  const settings = config();
  const state = snapshot();
  const events: string[] = [];
  const sent: Hex[] = [];
  let saved: Pending | null = null;
  let receipt: Receipt | null = null;
  const chain: Chain = {
    address: account.address,
    inspect: async () => state,
    receipt: async () => receipt,
    confirmedNonce: async () => 0,
    simulate: async () => {
      events.push("simulate");
    },
    estimateGas: async () => 450_000n,
    priorityFee: async () => 100_000_000n,
    sign: async ({ action, ...request }) => {
      events.push("sign");
      return account.signTransaction({
        ...request,
        chainId: 1,
        type: "eip1559",
        to: prisonAddress,
        data: callData(action),
        value: 0n,
      });
    },
    broadcast: async (raw) => {
      events.push("broadcast");
      sent.push(raw);
      return keccak256(raw);
    },
  };
  const store: Store = {
    reserve: async (tx) => {
      events.push("reserve");
      saved = tx;
      return true;
    },
    mayBroadcast: async () => {
      events.push("permission");
      return true;
    },
    result: async (_hash, status) => {
      events.push(status);
      return true;
    },
  };
  return {
    settings,
    state,
    events,
    sent,
    chain,
    store,
    saved: () => {
      assert.ok(saved);
      return saved;
    },
    setReceipt: (value: Receipt) => {
      receipt = value;
    },
  };
};

test("paused verification cannot simulate, sign, reserve, or broadcast", async () => {
  const f = fixture();
  f.settings.enabled = false;
  const result = await runKeeper(f.settings, f.chain, f.store);
  assert.equal(result.status, "paused");
  assert.equal(result.detail.nextAction, "startDailyDraw");
  assert.deepEqual(f.events, []);
});
test("only due starts and VRF-ready finalizations are selected", () => {
  const state = snapshot();
  assert.deepEqual(decide(state), {
    action: "startDailyDraw",
    intent: "start:200",
  });
  assert.deepEqual(decide({ ...state, timestamp: 199n }), {
    wait: "waiting_for_cutoff",
  });
  assert.deepEqual(decide({ ...state, available: 0n }), {
    wait: "no_inventory",
  });
  assert.deepEqual(decide({ ...state, closed: true }), { wait: "closed" });
  assert.deepEqual(decide({ ...state, pendingDrawId: 1n, pendingStatus: 1 }), {
    wait: "waiting_for_vrf",
  });
  assert.deepEqual(
    decide({
      ...state,
      pendingDrawId: 1n,
      pendingStatus: 1,
      timestamp: 86401n,
    }),
    { wait: "vrf_delayed" },
  );
  assert.deepEqual(
    decide({ ...state, pendingDrawId: 1n, pendingStatus: 2, readyAt: 200n }),
    {
      action: "finalizeDraw",
      intent: "finalize:1",
    },
  );
});
test("both actions wait the full 30 minutes, measured from cutoff and callback respectively", async () => {
  const f = fixture();
  for (const timestamp of [200n, 1999n]) {
    f.state.timestamp = timestamp;
    assert.equal(
      (await runKeeper(f.settings, f.chain, f.store)).status,
      "waiting_for_start_delay",
    );
  }
  assert.deepEqual(f.events, []);
  f.state.pendingDrawId = 1n;
  f.state.pendingStatus = 2;
  f.state.requestedAt = 100n;
  f.state.readyAt = 500n;
  f.state.timestamp = 2299n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "waiting_for_finalize_delay",
  );
  assert.deepEqual(f.events, []);
  f.state.timestamp = 2300n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "submitted",
  );
  assert.equal(f.saved().action, "finalizeDraw");
});
test("a ready draw without a canonical indexed timestamp never signs", async () => {
  const f = fixture();
  f.state.pendingDrawId = 1n;
  f.state.pendingStatus = 2;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "waiting_for_randomness_index",
  );
  assert.deepEqual(f.events, []);
});
test("wrong chain and unexpected wallet cannot sign", async () => {
  const f = fixture();
  f.state.chainId = 31337;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "wrong_chain",
  );
  f.state.chainId = 1;
  f.settings.walletAddress = prisonAddress;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "wallet_mismatch",
  );
  assert.deepEqual(f.events, []);
});
test("an unrelated pending nonce blocks new transactions", async () => {
  const f = fixture();
  f.state.pendingNonce = 1;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "external_pending_transaction",
  );
  assert.deepEqual(f.events, []);
});
test("fees, gas, transaction costs and wallet balance are bounded before signing", async () => {
  const f = fixture();
  f.state.baseFee = 10_000_000_000n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "fee_cap",
  );
  f.state.baseFee = 100_000_000n;
  f.state.balance = 1n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "low_balance",
  );
  f.state.balance = 10n ** 18n;
  f.settings.maxTxCostWei = 1n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "transaction_cost_cap",
  );
  f.settings.maxTxCostWei = config().maxTxCostWei;
  f.settings.maxGas = 300_000n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "gas_limit",
  );
  assert.ok(!f.events.includes("sign"));
});
test("transaction is validated and durably reserved before broadcast", async () => {
  const f = fixture();
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "submitted",
  );
  assert.deepEqual(f.events, [
    "simulate",
    "sign",
    "reserve",
    "permission",
    "broadcast",
    "broadcast",
  ]);
  const tx = parseTransaction(f.saved().rawTx);
  assert.equal(tx.chainId, 1);
  assert.equal(tx.to?.toLowerCase(), prisonAddress);
  assert.equal(tx.value ?? 0n, 0n);
  assert.equal(tx.data, callData("startDailyDraw"));
});
test("a rejected reservation or pause before broadcast sends nothing", async () => {
  const f = fixture();
  f.store.reserve = async () => false;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "reservation_rejected",
  );
  assert.equal(f.sent.length, 0);
  const g = fixture();
  g.store.mayBroadcast = async () => false;
  assert.equal(
    (await runKeeper(g.settings, g.chain, g.store)).status,
    "paused_or_lease_lost",
  );
  assert.equal(g.sent.length, 0);
});
test("ambiguous RPC failure retains and rebroadcasts the identical transaction without re-signing", async () => {
  const f = fixture();
  f.chain.broadcast = async (raw) => {
    f.sent.push(raw);
    throw new Error("Timed out after acceptance");
  };
  await assert.rejects(runKeeper(f.settings, f.chain, f.store));
  f.settings.pending = f.saved();
  f.chain.broadcast = async (raw) => {
    f.sent.push(raw);
    return keccak256(raw);
  };
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "rebroadcast",
  );
  assert.equal(f.sent[0], f.sent[1]);
  assert.equal(f.events.filter((e) => e === "sign").length, 1);
});
test("paused keeper cannot rebroadcast a prepared transaction", async () => {
  const f = fixture();
  await runKeeper(f.settings, f.chain, f.store);
  f.settings.pending = f.saved();
  f.settings.enabled = false;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "paused",
  );
  assert.equal(f.sent.length, 1);
});
test("confirmation waits 12 blocks, then settles without sending a second transaction", async () => {
  const f = fixture();
  await runKeeper(f.settings, f.chain, f.store);
  f.settings.pending = f.saved();
  f.setReceipt({ blockNumber: 95n, success: true, cost: 100n });
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "confirming",
  );
  f.state.blockNumber = 106n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "confirmed",
  );
  assert.equal(f.sent.length, 1);
});
test("confirmed revert and unknown replacement are recorded for automatic pause", async () => {
  const f = fixture();
  await runKeeper(f.settings, f.chain, f.store);
  f.settings.pending = f.saved();
  f.setReceipt({ blockNumber: 89n, success: false, cost: 100n });
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "reverted",
  );
  assert.ok(f.events.includes("reverted"));
  const g = fixture();
  await runKeeper(g.settings, g.chain, g.store);
  g.settings.pending = g.saved();
  g.state.latestNonce = 1;
  g.chain.confirmedNonce = async () => 1;
  assert.equal(
    (await runKeeper(g.settings, g.chain, g.store)).status,
    "nonce_conflict",
  );
  assert.ok(g.events.includes("nonce_conflict"));
  assert.equal(g.sent.length, 1);
});
test("stale or superseded intents are held for review without broadcasting", async () => {
  const f = fixture();
  await runKeeper(f.settings, f.chain, f.store);
  f.settings.pending = f.saved();
  f.state.nextDrawAt = 201n;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "intent_changed",
  );
  f.settings.pending.createdAt = Date.now() - 31 * 60_000;
  assert.equal(
    (await runKeeper(f.settings, f.chain, f.store)).status,
    "transaction_stuck",
  );
  assert.equal(f.sent.length, 1);
});
test("persisted signed bytes cannot be changed into ETH transfers or other contracts/chains", async () => {
  const f = fixture();
  await runKeeper(f.settings, f.chain, f.store);
  for (const change of [
    { value: 1n },
    { chainId: 31337 },
    { to: account.address },
    { data: "0x12345678" as Hex },
  ]) {
    const rawTx = await account.signTransaction({
      type: "eip1559",
      chainId: 1,
      to: prisonAddress,
      value: 0n,
      data: callData("startDailyDraw"),
      nonce: 0,
      gas: 550_000n,
      maxFeePerGas: 300_000_000n,
      maxPriorityFeePerGas: 100_000_000n,
      ...change,
    });
    await assert.rejects(
      validateTransaction(
        { ...f.saved(), rawTx, hash: keccak256(rawTx) },
        f.settings,
        account.address,
      ),
    );
  }
});
