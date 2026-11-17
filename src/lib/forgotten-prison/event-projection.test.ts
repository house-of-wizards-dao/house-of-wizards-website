import { projectPrisonEvents, type PrisonEvent } from "./event-projection";
import {
  biddingStatus,
  indexIsDelayed,
  prisonIndexSchema,
} from "./index-types";

const alice = `0x${"a".repeat(40)}`;
const bob = `0x${"b".repeat(40)}`;
const carol = `0x${"c".repeat(40)}`;
const event = (
  n: number,
  eventName: string,
  args: PrisonEvent["args"],
): PrisonEvent => ({
  eventName,
  args,
  blockNumber: n,
  transactionIndex: 0,
  logIndex: 0,
  timestamp: "2026-11-17T12:00:00Z",
  transactionHash: `0x${n.toString(16).padStart(64, "0")}`,
});
const bid = (n: number, bidder: string, amount: string, sequence = n) =>
  event(n, "BidPlaced", { bidder, amount, sequence: String(sequence) });
const start = (n: number, drawId = "1", winner = alice, price = "100") =>
  event(n, "DrawStarted", { drawId, winner, price, requestId: "999" });

describe("Forgotten Prison event projections", () => {
  it("uses full bid totals and replaces tie priority on an increase, without rounding wei", () => {
    const result = projectPrisonEvents([
      bid(1, alice, "90071992547409930001"),
      bid(2, bob, "90071992547409930002"),
      bid(3, alice, "90071992547409930002"),
    ]);
    expect(result.leaderboard.map((b) => b.bidder)).toEqual([bob, alice]);
    expect(result.leaderboard[1].amount).toBe("90071992547409930002");
  });
  it("removes cancelled bids and the locked winner but preserves losing and new bids", () => {
    const result = projectPrisonEvents([
      bid(1, alice, "100"),
      bid(2, bob, "50"),
      bid(3, carol, "20"),
      event(4, "BidCancelled", { bidder: carol }),
      start(5),
      bid(6, alice, "25"),
      event(7, "Shutdown", { abortedDrawId: "1" }),
    ]);
    expect(result.leaderboard.map((b) => [b.bidder, b.amount])).toEqual([
      [bob, "50"],
      [alice, "25"],
    ]);
    expect(result.history[0].status).toBe("aborted");
    expect(result.totalWonWei).toBe("0");
  });
  it("tracks requested, ready, finalized, and independent main/bonus claims including token zero", () => {
    const started = start(1);
    const ready = event(2, "RandomnessReceived", { drawId: "1" });
    expect(projectPrisonEvents([started]).history[0].status).toBe("requested");
    expect(projectPrisonEvents([started, ready]).history[0].status).toBe(
      "ready",
    );
    const finalized = [
      started,
      ready,
      event(3, "BonusAwarded", { drawId: "1", tokenId: "0" }),
      event(4, "DrawFinalized", { drawId: "1", collection: bob, tokenId: "0" }),
      event(5, "BonusClaimed", { drawId: "1", recipient: carol }),
    ];
    const result = projectPrisonEvents(finalized);
    expect(result.history[0]).toMatchObject({
      status: "finalized",
      boxTokenId: "0",
      tokenId: "0",
      claimed: false,
      bonusClaimed: true,
      bonusRecipient: carol,
    });
    expect(result.totalWonWei).toBe("100");
    expect(
      projectPrisonEvents([
        ...finalized,
        event(6, "NFTClaimed", { drawId: "1", recipient: bob }),
      ]).history[0],
    ).toMatchObject({ claimed: true, recipient: bob, bonusRecipient: carol });
  });
  it("orders logs inside a transaction and deduplicates retries", () => {
    const a = bid(1, alice, "100");
    const b = { ...start(1), logIndex: 1 };
    expect(projectPrisonEvents([b, a, a, b]).bidderCount).toBe(0);
    expect(projectPrisonEvents([b, a, a, b]).drawCount).toBe(1);
  });
  it("does not manufacture draws from skipped days or closure without a pending draw", () => {
    const result = projectPrisonEvents([
      event(1, "EmptyDaySkipped", { nextDrawAt: "99" }),
      event(2, "Shutdown", { abortedDrawId: "0" }),
    ]);
    expect(result.drawCount).toBe(0);
  });
});

describe("index display state", () => {
  it("distinguishes cutoff from a draw and preparation from exhaustion", () => {
    expect(
      biddingStatus({ closed: false, prizeCount: 1n, drawCount: 0n }, 0),
    ).toBe("Bidding closed · awaiting next round");
    expect(
      biddingStatus({ closed: false, prizeCount: 1n, drawCount: 1n }, 10),
    ).toBe("Bidding is open");
    expect(
      biddingStatus({ closed: false, prizeCount: 0n, drawCount: 0n }, 0),
    ).toBe("Awaiting prizes");
    expect(
      biddingStatus({ closed: false, prizeCount: 0n, drawCount: 1n }, 0),
    ).toBe("All prizes awarded");
  });
  it("rejects imprecise numeric wei in API responses and identifies a stalled sync", () => {
    const data = {
      source: "supabase",
      chainId: 1,
      contract: alice,
      blockNumber: 10,
      headBlock: 10,
      blockTimestamp: "2026-11-17T12:00:00Z",
      indexedAt: "2026-11-17T12:00:00Z",
      snapshot: {
        closed: false,
        nextDrawAt: "10",
        pendingDrawId: "0",
        drawCount: "0",
        prizeCount: "1",
        boxCount: "0",
        highestBidder: alice,
        highestBid: "100",
        pendingStatus: 0,
      },
      bidderCount: 1,
      leaderboard: [{ bidder: alice, amount: "100", sequence: "1" }],
      drawCount: 0,
      finalizedCount: 0,
      totalWonWei: "0",
      history: [],
    };
    const valid = prisonIndexSchema.parse(data);
    expect(indexIsDelayed(valid, Date.parse(data.indexedAt) + 181_000)).toBe(
      true,
    );
    expect(indexIsDelayed(valid, Date.parse(data.indexedAt) + 60_000)).toBe(
      false,
    );
    expect(
      indexIsDelayed({ ...valid, headBlock: 11 }, Date.parse(data.indexedAt)),
    ).toBe(true);
    expect(
      prisonIndexSchema.safeParse({
        ...data,
        totalWonWei: 90071992547409930001,
      }).success,
    ).toBe(false);
  });
});
