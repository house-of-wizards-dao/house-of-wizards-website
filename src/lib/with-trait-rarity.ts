import type { TraitRarityCollection } from "@/lib/trait-rarity";
import type { CharacterTrait, CountedCharacterTrait } from "@/types/character";

export const withTraitRarity = (
  traits: CharacterTrait[],
  rarity: TraitRarityCollection,
  collection: string,
): CountedCharacterTrait[] =>
  traits.map((trait) => {
    const count = rarity.parts[trait.partKey]?.[String(trait.traitId)];
    if (count === undefined) {
      throw new Error(
        `Missing ${collection} rarity for ${trait.partKey} ${trait.traitId}`,
      );
    }

    return { ...trait, count, total: rarity.total };
  });
