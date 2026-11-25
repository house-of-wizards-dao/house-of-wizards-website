export const EMPTY_TRAIT_ID = 7777;

export type TraitRarityCollection = {
  total: number;
  parts: Record<string, Record<string, number>>;
};

export const buildTraitRarity = <T extends object>(
  tokens: readonly T[],
  parts: readonly (keyof T & string)[],
  emptyTraitId = EMPTY_TRAIT_ID,
): TraitRarityCollection => {
  const partsOut: Record<string, Record<string, number>> = {};

  for (const part of parts) {
    const counts = new Map<number, number>();
    for (const token of tokens) {
      const traitId = token[part];
      if (typeof traitId !== "number" || traitId === emptyTraitId) continue;
      counts.set(traitId, (counts.get(traitId) ?? 0) + 1);
    }

    partsOut[part] = Object.fromEntries(
      [...counts.entries()]
        .sort(([left], [right]) => left - right)
        .map(([traitId, count]) => [String(traitId), count]),
    );
  }

  return { total: tokens.length, parts: partsOut };
};

export const normalizeTraitName = (name: string): string =>
  name.trim().replace(/\s+/g, " ").toLowerCase();

type NamedTrait = {
  idx: number;
  displayName: string;
  part?: string;
};

export const groupTraitCounts = (
  rarity: TraitRarityCollection,
  traits: readonly NamedTrait[],
): TraitRarityCollection => {
  const partsOut: TraitRarityCollection["parts"] = {};

  for (const [part, counts] of Object.entries(rarity.parts)) {
    const nameById = new Map<number, string>();
    for (const trait of traits) {
      if (trait.part === part) {
        nameById.set(trait.idx, normalizeTraitName(trait.displayName));
      }
    }

    const sumByName = new Map<string, number>();
    for (const [id, count] of Object.entries(counts)) {
      const name = nameById.get(Number(id));
      if (name === undefined) continue;
      sumByName.set(name, (sumByName.get(name) ?? 0) + count);
    }

    partsOut[part] = Object.fromEntries(
      Object.entries(counts).map(([id, count]) => {
        const name = nameById.get(Number(id));
        return [
          id,
          name === undefined ? count : (sumByName.get(name) ?? count),
        ];
      }),
    );
  }

  return { total: rarity.total, parts: partsOut };
};

export type TraitRarityTier =
  "common" | "standard" | "uncommon" | "rare" | "epic" | "unique";

// Bands follow how these traits were minted, not a percent of supply.
// 1 is unique. 2–10 is the 8-count layer, including Big Gross Eyeball at 9.
// 11–26 ends at Illuminatus. 27–64 holds The Mamba Stick (33) and the
// bodies in the 30s–60s. 65–159 is the normal head and prop plateau.
// 160 and above is the common mint: many bodies and props, the runes, and
// the familiars.
export const traitRarityTier = (count: number): TraitRarityTier => {
  if (count <= 1) return "unique";
  if (count <= 10) return "epic";
  if (count <= 26) return "rare";
  if (count <= 64) return "uncommon";
  if (count <= 159) return "standard";
  return "common";
};

export const formatTraitPercent = (count: number, total: number): string => {
  if (total <= 0 || count <= 0) return "0%";

  const percent = (count / total) * 100;
  if (percent >= 1) {
    const rounded = Math.round(percent * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
  }

  return `${(Math.round(percent * 100) / 100).toFixed(2)}%`;
};
