import { drawTiming } from "./draw-timing";
import type { Auction } from "./bidding";
import { indexedDrawSchema } from "./index-types";

const wallet = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" as const;
const auction: Auction = {
  closed: false,
  nextDrawAt: 2000n,
  pendingDrawId: 0n,
  drawCount: 0n,
  highestBid: [wallet, 1n],
  prizeCount: 1n,
  boxCount: 0n,
  eligible: [1n, 0n],
  bid: 0n,
  refund: 0n,
  balance: 0n,
  timestamp: 1999n,
  history: [],
};
const ready: Auction = {
  ...auction,
  pendingDrawId: 1n,
  drawCount: 1n,
  history: [
    {
      id: 1n,
      winner: wallet,
      price: 1n,
      requestId: 123n,
      requestedAt: 1000n,
      inventorySize: 1n,
      boxInventorySize: 0n,
      randomWord: 0n,
      bonusWord: 0n,
      collection: wallet,
      tokenId: 0n,
      boxTokenId: 0n,
      status: 2,
      claimed: false,
      bonusAwarded: false,
      bonusClaimed: false,
    },
  ],
};
const indexed = indexedDrawSchema.parse({
  id: "1",
  winner: wallet,
  price: "1",
  status: "ready",
  requestId: "123",
  startedAt: new Date(1000_000).toISOString(),
  readyAt: new Date(1500_000).toISOString(),
  finalizedAt: null,
  startTx: `0x${"1".repeat(64)}`,
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

it("allows manual start exactly at cutoff but schedules automation 30 minutes later", () => {
  expect(drawTiming(auction)).toEqual({
    action: "startDailyDraw",
    canExecute: false,
    automationAt: 3800n,
  });
  expect(drawTiming({ ...auction, timestamp: 2000n })?.canExecute).toBe(true);
});
it("uses callback time for finalization and allows speed up even when the index is behind", () => {
  expect(drawTiming(ready, indexed)).toEqual({
    action: "finalizeDraw",
    canExecute: true,
    automationAt: 3300n,
  });
  expect(drawTiming(ready)).toEqual({
    action: "finalizeDraw",
    canExecute: true,
    automationAt: null,
  });
  expect(
    drawTiming(ready, { ...indexed, requestId: "124" })?.automationAt,
  ).toBeNull();
});
it("never offers a transaction while waiting for VRF, after closure or with no inventory", () => {
  expect(
    drawTiming({
      ...ready,
      history: ready.history.map((draw) => ({ ...draw, status: 1 })),
    }),
  ).toBeNull();
  expect(drawTiming({ ...ready, closed: true })).toBeNull();
  expect(drawTiming({ ...auction, prizeCount: 0n })).toBeNull();
});
