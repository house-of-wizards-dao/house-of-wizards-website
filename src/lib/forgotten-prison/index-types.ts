import { z } from "zod";

const uint = z.string().regex(/^\d+$/);
const address = z.string().regex(/^0x[\da-fA-F]{40}$/);
const hash = z.string().regex(/^0x[\da-fA-F]{64}$/);
const date = z.string().datetime({ offset: true });
export const indexedPrizeSchema = z.object({
  collection: address,
  tokenId: uint,
  kind: z.enum(["Warrior", "Wizard"]),
  status: z.enum(["available", "awarded", "claimed", "recovered"]),
  drawId: uint.nullable(),
  updatedAt: date,
  name: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
});
export type IndexedPrize = z.infer<typeof indexedPrizeSchema>;
export const indexedDrawSchema = z.object({
  id: uint,
  winner: address,
  price: uint,
  status: z.enum(["requested", "ready", "finalized", "aborted"]),
  startedAt: date,
  readyAt: date.nullable().default(null),
  finalizedAt: date.nullable(),
  startTx: hash,
  finalizeTx: hash.nullable(),
  requestId: uint,
  collection: address.nullable(),
  tokenId: uint.nullable(),
  boxTokenId: uint.nullable(),
  claimed: z.boolean(),
  bonusClaimed: z.boolean(),
  recipient: address.nullable(),
  bonusRecipient: address.nullable(),
  claimTx: hash.nullable(),
  bonusClaimTx: hash.nullable(),
});
export const prisonIndexSchema = z.object({
  source: z.enum(["supabase", "local"]),
  chainId: z.union([z.literal(1), z.literal(31337)]),
  contract: address,
  blockNumber: z.number().int().nonnegative(),
  headBlock: z.number().int().nonnegative(),
  blockTimestamp: date,
  indexedAt: date,
  snapshot: z.object({
    closed: z.boolean(),
    nextDrawAt: uint,
    pendingDrawId: uint,
    drawCount: uint,
    prizeCount: uint,
    boxCount: uint,
    highestBidder: address,
    highestBid: uint,
    pendingStatus: z.number().int().min(0).max(4),
  }),
  bidderCount: z.number().int().nonnegative(),
  leaderboard: z.array(
    z.object({ bidder: address, amount: uint, sequence: uint }),
  ),
  drawCount: z.number().int().nonnegative(),
  finalizedCount: z.number().int().nonnegative(),
  totalWonWei: uint,
  history: z.array(indexedDrawSchema),
  prizes: z.array(indexedPrizeSchema).default([]),
});
export type PrisonIndex = z.infer<typeof prisonIndexSchema>;
export type IndexedDraw = z.infer<typeof indexedDrawSchema>;
export type IndexedBid = PrisonIndex["leaderboard"][number];

export const indexIsDelayed = (index: PrisonIndex, now: number) =>
  index.headBlock > index.blockNumber ||
  now - Date.parse(index.indexedAt) > 180_000;

export const drawStatusLabel = (status: IndexedDraw["status"]) =>
  ({
    requested: "Waiting for randomness",
    ready: "Randomness received · awaiting settlement",
    finalized: "Prize awarded",
    aborted: "Aborted · payment refundable",
  })[status];

// The cutoff alone does not request randomness. New bids can open for the next
// round while the preceding draw is still being settled.
export const biddingStatus = (
  state: {
    closed: boolean;
    prizeCount: bigint;
    drawCount: bigint;
  },
  remaining: number,
) =>
  state.closed
    ? "Auction ended"
    : state.prizeCount === 0n
      ? state.drawCount === 0n
        ? "Awaiting prizes"
        : "All prizes awarded"
      : remaining > 0
        ? "Bidding is open"
        : "Bidding closed · awaiting next round";
