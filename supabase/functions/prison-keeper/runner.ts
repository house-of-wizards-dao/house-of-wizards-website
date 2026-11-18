import {
  encodeFunctionData,
  keccak256,
  parseTransaction,
  recoverTransactionAddress,
  type Address,
  type Hex,
  type TransactionSerializedEIP1559,
} from "viem";
import { prisonAbi } from "../_shared/abi.ts";
import { automationDelaySeconds } from "../_shared/draw-timing.ts";

export const prisonAddress =
  "0x7a258a7ed776d88ec7e19a03019a632c4f097ef8" as const;
export type Action = "startDailyDraw" | "finalizeDraw";
export type Pending = {
  hash: Hex;
  signer: Address;
  nonce: number;
  action: Action;
  intent: string;
  rawTx: Hex;
  maxCostWei: bigint;
  createdAt: number;
};
export type Settings = {
  enabled: boolean;
  walletAddress: string | null;
  maxFeeWei: bigint;
  maxPriorityFeeWei: bigint;
  maxGas: bigint;
  maxTxCostWei: bigint;
  max24hCostWei: bigint;
  pending: Pending | null;
};
export type Snapshot = {
  chainId: number;
  blockNumber: bigint;
  timestamp: bigint;
  baseFee: bigint;
  closed: boolean;
  available: bigint;
  nextDrawAt: bigint;
  pendingDrawId: bigint;
  pendingStatus: number;
  requestedAt: bigint;
  readyAt: bigint | null;
  balance: bigint;
  latestNonce: number;
  pendingNonce: number;
};
export type Receipt = {
  blockNumber: bigint;
  success: boolean;
  cost: bigint;
};
export type Report = {
  status: string;
  detail: Record<string, string | number | boolean>;
};
export type Chain = {
  address: Address;
  inspect: () => Promise<Snapshot>;
  receipt: (hash: Hex) => Promise<Receipt | null>;
  confirmedNonce: () => Promise<number>;
  simulate: (action: Action) => Promise<void>;
  estimateGas: (action: Action) => Promise<bigint>;
  priorityFee: () => Promise<bigint>;
  sign: (request: {
    action: Action;
    nonce: number;
    gas: bigint;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
  }) => Promise<Hex>;
  broadcast: (rawTx: Hex) => Promise<Hex>;
};
export type Store = {
  reserve: (transaction: Pending) => Promise<boolean>;
  mayBroadcast: (hash: Hex) => Promise<boolean>;
  result: (
    hash: Hex,
    status: "broadcast" | "confirmed" | "reverted" | "nonce_conflict",
    receipt?: Receipt,
  ) => Promise<boolean>;
};
export const callData = (action: Action) =>
  encodeFunctionData({ abi: prisonAbi, functionName: action });

export const decide = (
  state: Snapshot,
): { action: Action; intent: string } | { wait: string } => {
  if (state.closed) return { wait: "closed" };
  if (state.pendingDrawId !== 0n) {
    if (state.pendingStatus === 2) {
      if (state.readyAt === null)
        return { wait: "waiting_for_randomness_index" };
      if (state.timestamp < state.readyAt + automationDelaySeconds)
        return { wait: "waiting_for_finalize_delay" };
      return {
        action: "finalizeDraw",
        intent: `finalize:${state.pendingDrawId}`,
      };
    }
    if (state.pendingStatus === 1)
      return {
        wait:
          state.timestamp >= state.requestedAt + 86400n
            ? "vrf_delayed"
            : "waiting_for_vrf",
      };
    return { wait: "unexpected_draw_status" };
  }
  if (state.available === 0n) return { wait: "no_inventory" };
  if (state.timestamp < state.nextDrawAt) return { wait: "waiting_for_cutoff" };
  if (state.timestamp < state.nextDrawAt + automationDelaySeconds)
    return { wait: "waiting_for_start_delay" };
  // Empty-day starts also promote newly deposited inventory for the next round.
  // Never call shutdown, recovery, claims, withdrawals, or a VRF callback.
  return { action: "startDailyDraw", intent: `start:${state.nextDrawAt}` };
};

// Validate persisted bytes as well as newly signed transactions. A retry cannot
// turn this process into an arbitrary transaction broadcaster.
export const validateTransaction = async (
  tx: Pending,
  settings: Settings,
  wallet: Address,
) => {
  if (!tx.rawTx.startsWith("0x02"))
    throw new Error("Invalid keeper transaction type");
  const parsed = parseTransaction(tx.rawTx);
  if (
    parsed.type !== "eip1559" ||
    parsed.chainId !== 1 ||
    parsed.to?.toLowerCase() !== prisonAddress ||
    (parsed.value ?? 0n) !== 0n ||
    parsed.data !== callData(tx.action) ||
    parsed.nonce !== tx.nonce ||
    (parsed.accessList?.length ?? 0) !== 0 ||
    !parsed.gas ||
    parsed.gas > settings.maxGas ||
    !parsed.maxFeePerGas ||
    parsed.maxFeePerGas > settings.maxFeeWei ||
    parsed.maxPriorityFeePerGas === undefined ||
    parsed.maxPriorityFeePerGas > settings.maxPriorityFeeWei ||
    parsed.maxPriorityFeePerGas > parsed.maxFeePerGas ||
    parsed.gas * parsed.maxFeePerGas !== tx.maxCostWei ||
    tx.maxCostWei > settings.maxTxCostWei ||
    keccak256(tx.rawTx) !== tx.hash ||
    tx.signer.toLowerCase() !== wallet.toLowerCase() ||
    (
      await recoverTransactionAddress({
        serializedTransaction: tx.rawTx as TransactionSerializedEIP1559,
      })
    ).toLowerCase() !== wallet.toLowerCase()
  )
    throw new Error("Invalid keeper transaction");
};

export const runKeeper = async (
  settings: Settings,
  chain: Chain,
  store: Store,
): Promise<Report> => {
  const state = await chain.inspect();
  const summary = {
    wallet: chain.address.toLowerCase(),
    balanceWei: state.balance.toString(),
    block: state.blockNumber.toString(),
  };
  const report = (status: string, detail: Report["detail"] = {}): Report => ({
    status,
    detail: { ...summary, ...detail },
  });
  if (state.chainId !== 1) return report("wrong_chain");
  if (
    settings.walletAddress &&
    settings.walletAddress.toLowerCase() !== chain.address.toLowerCase()
  )
    return report("wallet_mismatch");
  const choice = decide(state);
  // This exit precedes simulation, signing, reservation, and every broadcast.
  if (!settings.enabled)
    return report("paused", {
      nextAction: "action" in choice ? choice.action : choice.wait,
      pendingTransaction: !!settings.pending,
    });
  if (!settings.walletAddress) return report("wallet_not_initialized");

  if (settings.pending) {
    const tx = settings.pending;
    await validateTransaction(tx, settings, chain.address);
    const receipt = await chain.receipt(tx.hash);
    if (receipt) {
      if (state.blockNumber < receipt.blockNumber + 11n)
        return report("confirming", { hash: tx.hash });
      const status = receipt.success ? "confirmed" : "reverted";
      if (!(await store.result(tx.hash, status, receipt)))
        return report("lease_lost");
      return report(status, { hash: tx.hash });
    }
    if (state.latestNonce > tx.nonce) {
      if ((await chain.confirmedNonce()) > tx.nonce) {
        if (!(await store.result(tx.hash, "nonce_conflict")))
          return report("lease_lost");
        return report("nonce_conflict", { hash: tx.hash });
      }
      return report("awaiting_receipt", { hash: tx.hash });
    }
    if (Date.now() - tx.createdAt > 30 * 60_000)
      return report("transaction_stuck", { hash: tx.hash });
    if (!("action" in choice) || choice.intent !== tx.intent)
      return report("intent_changed", { hash: tx.hash });
    if (!(await store.mayBroadcast(tx.hash)))
      return report("paused_or_lease_lost");
    // An RPC timeout is ambiguous: retain the outbox and retry these SAME bytes.
    const returnedHash = await chain.broadcast(tx.rawTx);
    if (returnedHash !== tx.hash)
      throw new Error("Unexpected transaction hash");
    if (!(await store.result(tx.hash, "broadcast")))
      return report("lease_lost", { hash: tx.hash });
    return report("rebroadcast", { hash: tx.hash });
  }

  if (!("action" in choice)) return report(choice.wait);
  if (state.latestNonce !== state.pendingNonce)
    return report("external_pending_transaction");
  if (state.balance === 0n) return report("low_balance");
  const suggestedTip = await chain.priorityFee();
  const tip =
    suggestedTip < settings.maxPriorityFeeWei
      ? suggestedTip
      : settings.maxPriorityFeeWei;
  const fee = state.baseFee * 2n + tip;
  if (fee > settings.maxFeeWei)
    return report("fee_cap", { suggestedMaxFeeWei: fee.toString() });
  await chain.simulate(choice.action);
  const estimate = await chain.estimateGas(choice.action);
  const gas = (estimate * 120n + 99n) / 100n + 10_000n;
  const maxCost = gas * fee;
  if (gas > settings.maxGas)
    return report("gas_limit", { estimatedGas: gas.toString() });
  if (maxCost > settings.maxTxCostWei) return report("transaction_cost_cap");
  if (state.balance < maxCost)
    return report("low_balance", { requiredWei: maxCost.toString() });
  const rawTx = await chain.sign({
    action: choice.action,
    nonce: state.latestNonce,
    gas,
    maxFeePerGas: fee,
    maxPriorityFeePerGas: tip,
  });
  const tx: Pending = {
    hash: keccak256(rawTx),
    rawTx,
    action: choice.action,
    intent: choice.intent,
    nonce: state.latestNonce,
    signer: chain.address.toLowerCase() as Address,
    maxCostWei: maxCost,
    createdAt: Date.now(),
  };
  await validateTransaction(tx, settings, chain.address);
  if (!(await store.reserve(tx))) return report("reservation_rejected");
  if (!(await store.mayBroadcast(tx.hash)))
    return report("paused_or_lease_lost");
  const hash = await chain.broadcast(rawTx);
  if (hash !== tx.hash) throw new Error("Unexpected transaction hash");
  if (!(await store.result(hash, "broadcast")))
    return report("lease_lost", { hash });
  return report("submitted", {
    hash,
    action: choice.action,
    maxCostWei: maxCost.toString(),
  });
};
