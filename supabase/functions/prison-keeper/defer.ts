import { z } from "zod";
import { automationDelaySeconds } from "../_shared/draw-timing.ts";
import type { Report } from "./runner.ts";

const uint = z.string().regex(/^\d+$/).transform(BigInt);
const date = z.string().datetime({ offset: true }).transform(Date.parse);
const indexSchema = z.object({
  cursor_block: z.number().int().nonnegative(),
  head_block: z.number().int().nonnegative(),
  indexed_at: date,
  block_timestamp: date,
  snapshot: z.object({
    closed: z.boolean(),
    prizeCount: uint,
    nextDrawAt: uint,
    pendingDrawId: uint,
    pendingStatus: z.number().int().min(0).max(4),
  }),
});
const callbackSchema = z.object({
  block_number: z.number().int().nonnegative(),
  block_timestamp: date,
  args: z.object({ drawId: uint }),
});

// This cache can only postpone a live check. It can never authorize a transaction.
// Stale/missing data fails open to the existing on-chain checks, not to signing.
export const readKeeperDeferral = async (
  loadIndex: () => Promise<unknown>,
  loadCallback: (drawId: string) => Promise<unknown>,
  now = Date.now(),
): Promise<Report | null> => {
  // Keep a live audit every 15 minutes even during quiet periods or delayed VRF.
  if (Math.floor(now / 60_000) % 15 === 0) return null;
  try {
    const parsed = indexSchema.safeParse(await loadIndex());
    if (!parsed.success) return null;
    const index = parsed.data;
    if (
      index.cursor_block !== index.head_block ||
      [index.indexed_at, index.block_timestamp].some(
        (time) => time > now || now - time > 180_000,
      )
    )
      return null;
    const state = index.snapshot;
    const wait = (status: string, dueAt?: bigint): Report => ({
      status,
      detail: {
        source: "index",
        rpcSkipped: true,
        block: index.cursor_block,
        ...(dueAt === undefined ? {} : { automationAt: dueAt.toString() }),
      },
    });
    const seconds = BigInt(Math.floor(now / 1000));
    if (state.closed) return wait("closed");
    if (state.pendingDrawId > 0n) {
      if (state.pendingStatus === 1) return wait("waiting_for_vrf");
      if (state.pendingStatus !== 2) return null;
      const callback = callbackSchema.safeParse(
        await loadCallback(state.pendingDrawId.toString()),
      );
      if (
        !callback.success ||
        callback.data.args.drawId !== state.pendingDrawId ||
        callback.data.block_number > index.cursor_block ||
        callback.data.block_timestamp > index.block_timestamp
      )
        return null;
      const dueAt =
        BigInt(Math.floor(callback.data.block_timestamp / 1000)) +
        automationDelaySeconds;
      return seconds < dueAt - 60n
        ? wait("waiting_for_finalize_delay", dueAt)
        : null;
    }
    if (state.pendingStatus !== 0) return null;
    if (state.prizeCount === 0n) return wait("no_inventory");
    const dueAt = state.nextDrawAt + automationDelaySeconds;
    // Start live checks one minute early. The runner still enforces the exact
    // 30-minute delay using the latest Ethereum block timestamp.
    return seconds < dueAt - 60n
      ? wait(
          seconds < state.nextDrawAt
            ? "waiting_for_cutoff"
            : "waiting_for_start_delay",
          dueAt,
        )
      : null;
  } catch {
    return null;
  }
};
