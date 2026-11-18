import { projectPrisonInventory } from "./inventory";
import { prisonCharacter } from "./character-catalog";
import { COLLECTIONS } from "./config";
import type { PrisonEvent } from "./event-projection";

const event = (
  n: number,
  eventName: string,
  args: PrisonEvent["args"] = {},
): PrisonEvent => ({
  eventName,
  args: { collection: COLLECTIONS.Warriors, tokenId: "0", ...args },
  blockNumber: n,
  transactionIndex: 0,
  logIndex: 0,
  timestamp: "2026-11-18T00:00:00Z",
  transactionHash: `0x${String(n).padStart(64, "0")}`,
});
it("removes a prize at award before claim, retains history, and handles returns and recovery", () => {
  const events = [
    event(1, "InventoryDeposited"),
    event(2, "DrawFinalized", { drawId: "1" }),
  ];
  expect(projectPrisonInventory(events)[0].status).toBe("awarded");
  events.push(event(3, "NFTClaimed", { drawId: "1" }));
  expect(projectPrisonInventory(events)[0].status).toBe("claimed");
  events.push(event(4, "InventoryDeposited"));
  expect(projectPrisonInventory(events)[0]).toMatchObject({
    status: "available",
    drawId: null,
  });
  events.push(event(5, "UnsoldNFTRecovered"));
  expect(projectPrisonInventory(events)[0].status).toBe("recovered");
  expect(projectPrisonInventory(events.slice(0, 4))[0].status).toBe(
    "available",
  );
});
it("keys by collection and token, excludes boxes, and honors intra-transaction order", () => {
  const deposit = event(1, "InventoryDeposited");
  const award = { ...event(1, "DrawFinalized", { drawId: "1" }), logIndex: 1 };
  const result = projectPrisonInventory([
    award,
    deposit,
    event(2, "InventoryDeposited", { collection: COLLECTIONS.Wizards }),
    event(3, "InventoryDeposited", { collection: COLLECTIONS["Imp boxes"] }),
  ]);
  expect(result).toHaveLength(2);
  expect(result.map((p) => p.status)).toEqual(["awarded", "available"]);
});
it("resolves known names and durable image links without a network request", () => {
  expect(prisonCharacter(COLLECTIONS.Warriors, "0")).toMatchObject({
    name: "The Emissary",
    imageUrl: "https://portal.forgottenrunes.com/api/warriors/img/0.png",
  });
  expect(prisonCharacter(COLLECTIONS.Wizards, "0")?.name).toBe(
    "Holy Arcanist Illuminus of the Heavens",
  );
  expect(prisonCharacter(COLLECTIONS.Wizards, "-1")).toBeNull();
  expect(prisonCharacter(COLLECTIONS["Imp boxes"], "0")).toBeNull();
});
