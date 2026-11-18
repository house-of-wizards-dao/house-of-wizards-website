import { COLLECTIONS } from "./config";
import type { IndexedPrize } from "./index-types";
import type { PrisonEvent } from "./event-projection";

export const prizeKey = (collection: string, tokenId: string | bigint) =>
  `${collection.toLowerCase()}:${tokenId}`;
export const prizeKind = (collection: string) =>
  collection.toLowerCase() === COLLECTIONS.Wizards.toLowerCase()
    ? "Wizard"
    : "Warrior";

export const projectPrisonInventory = (
  events: PrisonEvent[],
): IndexedPrize[] => {
  const prizes = new Map<string, IndexedPrize>();
  for (const event of [...events].sort(
    (a, b) =>
      a.blockNumber - b.blockNumber ||
      a.transactionIndex - b.transactionIndex ||
      a.logIndex - b.logIndex,
  )) {
    const statuses: Record<string, IndexedPrize["status"]> = {
      InventoryDeposited: "available",
      DrawFinalized: "awarded",
      NFTClaimed: "claimed",
      UnsoldNFTRecovered: "recovered",
    };
    const status = statuses[event.eventName];
    const collection = event.args.collection;
    const tokenId = event.args.tokenId;
    if (
      !status ||
      typeof collection !== "string" ||
      typeof tokenId !== "string"
    )
      continue;
    if (
      ![
        COLLECTIONS.Warriors.toLowerCase(),
        COLLECTIONS.Wizards.toLowerCase(),
      ].includes(collection.toLowerCase())
    )
      continue;
    prizes.set(prizeKey(collection, tokenId), {
      collection: collection.toLowerCase(),
      tokenId,
      kind: prizeKind(collection),
      status,
      drawId: typeof event.args.drawId === "string" ? event.args.drawId : null,
      updatedAt: event.timestamp,
      name: null,
      imageUrl: null,
    });
  }
  return [...prizes.values()];
};
