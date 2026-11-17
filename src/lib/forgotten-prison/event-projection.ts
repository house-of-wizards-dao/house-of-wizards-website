import type { IndexedBid, IndexedDraw } from "./index-types";

// Used by the isolated local-fork preview; mainnet projections live in Postgres.
export type PrisonEvent = {
  eventName: string;
  args: Record<string, string | boolean>;
  blockNumber: number;
  transactionIndex: number;
  logIndex: number;
  timestamp: string;
  transactionHash: string;
};
const field = (event: PrisonEvent, name: string) => {
  const value = event.args[name];
  if (typeof value !== "string")
    throw new Error(`Missing ${event.eventName}.${name}`);
  return value;
};
export const projectPrisonEvents = (events: PrisonEvent[]) => {
  const bids = new Map<string, IndexedBid>();
  const draws = new Map<string, IndexedDraw>();
  const seen = new Set<string>();
  for (const event of [...events].sort(
    (a, b) =>
      a.blockNumber - b.blockNumber ||
      a.transactionIndex - b.transactionIndex ||
      a.logIndex - b.logIndex,
  )) {
    const key = `${event.transactionHash}:${event.logIndex}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (event.eventName === "BidPlaced") {
      const bidder = field(event, "bidder").toLowerCase();
      bids.set(bidder, {
        bidder,
        amount: field(event, "amount"),
        sequence: field(event, "sequence"),
      });
    } else if (event.eventName === "BidCancelled") {
      bids.delete(field(event, "bidder").toLowerCase());
    } else if (event.eventName === "DrawStarted") {
      const winner = field(event, "winner").toLowerCase();
      bids.delete(winner);
      const id = field(event, "drawId");
      draws.set(id, {
        id,
        winner,
        price: field(event, "price"),
        requestId: field(event, "requestId"),
        status: "requested",
        startedAt: event.timestamp,
        startTx: event.transactionHash,
        finalizedAt: null,
        finalizeTx: null,
        collection: null,
        tokenId: null,
        boxTokenId: null,
        claimed: false,
        bonusClaimed: false,
        recipient: null,
        bonusRecipient: null,
        claimTx: null,
        bonusClaimTx: null,
      });
    } else {
      const id =
        event.eventName === "Shutdown"
          ? event.args.abortedDrawId
          : event.args.drawId;
      const draw = typeof id === "string" ? draws.get(id) : undefined;
      if (!draw) continue;
      switch (event.eventName) {
        case "RandomnessReceived":
          draw.status = "ready";
          break;
        case "DrawFinalized":
          Object.assign(draw, {
            status: "finalized",
            finalizedAt: event.timestamp,
            finalizeTx: event.transactionHash,
            collection: field(event, "collection").toLowerCase(),
            tokenId: field(event, "tokenId"),
          });
          break;
        case "BonusAwarded":
          draw.boxTokenId = field(event, "tokenId");
          break;
        case "NFTClaimed":
          Object.assign(draw, {
            claimed: true,
            recipient: field(event, "recipient").toLowerCase(),
            claimTx: event.transactionHash,
          });
          break;
        case "BonusClaimed":
          Object.assign(draw, {
            bonusClaimed: true,
            bonusRecipient: field(event, "recipient").toLowerCase(),
            bonusClaimTx: event.transactionHash,
          });
          break;
        case "Shutdown":
          draw.status = "aborted";
          break;
      }
    }
  }
  const leaderboard = [...bids.values()].sort((a, b) => {
    const difference =
      BigInt(b.amount) - BigInt(a.amount) ||
      BigInt(a.sequence) - BigInt(b.sequence);
    return difference > 0n ? 1 : difference < 0n ? -1 : 0;
  });
  const history = [...draws.values()].sort((a, b) =>
    Number(BigInt(b.id) - BigInt(a.id)),
  );
  const finalized = history.filter((draw) => draw.status === "finalized");
  return {
    leaderboard,
    history,
    bidderCount: bids.size,
    drawCount: draws.size,
    finalizedCount: finalized.length,
    totalWonWei: finalized
      .reduce((sum, draw) => sum + BigInt(draw.price), 0n)
      .toString(),
  };
};
