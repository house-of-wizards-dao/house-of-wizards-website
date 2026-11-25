import {
  buildTraitRarity,
  formatTraitPercent,
  groupTraitCounts,
  normalizeTraitName,
  traitRarityTier,
} from "./trait-rarity";

const tokens = [
  { head: 1, familiar: 7777 },
  { head: 1, familiar: 9 },
  { head: 2, familiar: 9 },
  { head: 7777, familiar: 7777 },
];

it("counts trait occurrences and skips the empty slot", () => {
  const rarity = buildTraitRarity(tokens, ["head", "familiar"] as const);

  expect(rarity.total).toBe(4);
  expect(rarity.parts.head).toEqual({ "1": 2, "2": 1 });
  expect(rarity.parts.familiar).toEqual({ "9": 2 });
  expect(rarity.parts.head["7777"]).toBeUndefined();
});

it("colors traits from mint count, not share of supply", () => {
  expect(traitRarityTier(1)).toBe("unique");
  expect(traitRarityTier(8)).toBe("epic");
  expect(traitRarityTier(10)).toBe("epic");
  expect(traitRarityTier(11)).toBe("rare");
  expect(traitRarityTier(26)).toBe("rare");
  expect(traitRarityTier(33)).toBe("uncommon");
  expect(traitRarityTier(64)).toBe("uncommon");
  expect(traitRarityTier(72)).toBe("standard");
  expect(traitRarityTier(159)).toBe("standard");
  expect(traitRarityTier(160)).toBe("common");
});

it("normalizes a trait name for matching", () => {
  expect(normalizeTraitName(" Purple  Yoga ")).toBe("purple yoga");
});

it("stores the summed count on every matching id", () => {
  const rarity = {
    total: 200,
    parts: {
      body: { "31": 61, "32": 63, "33": 36, "71": 9 },
      head: { "239": 26 },
    },
  };
  const traits = [
    { idx: 31, part: "body", displayName: "Purple Yoga" },
    { idx: 32, part: "body", displayName: "Purple Yoga " },
    { idx: 33, part: "body", displayName: "Red Yoga" },
    { idx: 71, part: "body", displayName: "Gold Skeleton" },
    { idx: 239, part: "head", displayName: "Gold Skeleton" },
  ];

  const grouped = groupTraitCounts(rarity, traits);

  expect(grouped.total).toBe(200);
  expect(grouped.parts.body["31"]).toBe(124);
  expect(grouped.parts.body["32"]).toBe(124);
  expect(grouped.parts.body["33"]).toBe(36);
  expect(grouped.parts.body["71"]).toBe(9);
  expect(grouped.parts.head["239"]).toBe(26);
});

it("formats rarity as a share of the collection", () => {
  expect(formatTraitPercent(2, 4)).toBe("50%");
  expect(formatTraitPercent(1, 10000)).toBe("0.01%");
  expect(formatTraitPercent(1240, 10000)).toBe("12.4%");
  expect(formatTraitPercent(0, 0)).toBe("0%");
});
