import { automationDelaySeconds } from "../../../supabase/functions/_shared/draw-timing";
import type { Auction } from "./bidding";
import type { IndexedDraw } from "./index-types";

export const drawTiming = (auction: Auction, indexed?: IndexedDraw) => {
  if (auction.closed) return null;
  if (auction.pendingDrawId !== 0n) {
    const draw = auction.history.find(
      (draw) => draw.id === auction.pendingDrawId,
    );
    if (draw?.status !== 2) return null;
    const readyAt =
      indexed?.id === draw.id.toString() &&
      indexed.requestId === draw.requestId.toString() &&
      indexed.readyAt
        ? BigInt(Math.floor(Date.parse(indexed.readyAt) / 1000))
        : null;
    return {
      action: "finalizeDraw" as const,
      canExecute: true,
      automationAt: readyAt === null ? null : readyAt + automationDelaySeconds,
    };
  }
  if (auction.prizeCount === 0n) return null;
  return {
    action: "startDailyDraw" as const,
    canExecute: auction.timestamp >= auction.nextDrawAt,
    automationAt: auction.nextDrawAt + automationDelaySeconds,
  };
};
