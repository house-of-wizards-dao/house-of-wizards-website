import "server-only";
import { formatTraitPart } from "@/lib/trait-part-label";
import { EMPTY_TRAIT_ID } from "@/lib/trait-rarity";
import type { CharacterTrait } from "@/types/character";
import type {
  LocalNftCollection,
  LocalNftAffinity,
} from "@/types/nft-metadata";
import {
  soulDisplayParts,
  warriorDisplayParts,
  wizardDisplayParts,
} from "./character-display-parts";
import { soulAffinities } from "./soulAffinity";
import { soulTraits, type Trait as SoulTrait } from "./soulTraits";
import { soulsWithTraitsMap } from "./soulsWithTraitsMap";
import { warriorAffinities } from "./warriorAffinity";
import { warriorTraits, type Trait as WarriorTrait } from "./warriorTraits";
import { warriorsWithTraitsMap } from "./warriorsWithTraitsMap";
import { wizardAffinities } from "./wizardAffinity";
import { wizardTraits, type Trait as WizardTrait } from "./wizardTraits";
import { wizardsWithTraitsMap } from "./wizardsWithTraitsMap";

/**
 * Sentinel "no trait" id used in the FRWC trait maps for absent slots
 * (e.g. a wizard with no familiar will have `familiar: 7777`).
 */
const WIZARD_MAX_AFFINITY_TRAITS = 5;
const WARRIOR_MAX_AFFINITY_TRAITS = 6;
const SOUL_MAX_AFFINITY_TRAITS = 5;

const soulTraitsById = new Map<number, SoulTrait>(
  soulTraits.map((trait) => [trait.idx, trait]),
);

const wizardTraitsById = new Map<number, WizardTrait>(
  wizardTraits.map((trait) => [trait.idx, trait]),
);

const warriorTraitsById = new Map<number, WarriorTrait>(
  warriorTraits.map((trait) => [trait.idx, trait]),
);

/**
 * Resolve display traits for a wizard or warrior token from the local
 * trait maps. Returns an empty array for unknown collections or token IDs.
 */
export const getLocalNftTraits = (
  collection: LocalNftCollection,
  tokenId: string,
): CharacterTrait[] => {
  if (collection === "wizards") {
    const wizard = wizardsWithTraitsMap[tokenId];
    if (!wizard) return [];

    return wizardDisplayParts.flatMap((part) => {
      const traitId = wizard[part];
      const trait = wizardTraitsById.get(traitId);
      if (traitId === EMPTY_TRAIT_ID || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          partKey: part,
          traitId,
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  if (collection === "souls") {
    const soul = soulsWithTraitsMap[tokenId];
    if (!soul) return [];

    return soulDisplayParts.flatMap((part) => {
      const traitId = soul[part];
      const trait = soulTraitsById.get(traitId);
      if (traitId === EMPTY_TRAIT_ID || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          partKey: part,
          traitId,
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  const warrior = warriorsWithTraitsMap[tokenId];
  if (!warrior) return [];

  return warriorDisplayParts.flatMap((part) => {
    const traitId = warrior[part];
    const trait = warriorTraitsById.get(traitId);
    if (traitId === EMPTY_TRAIT_ID || !trait) return [];

    return [
      {
        part: formatTraitPart(part),
        partKey: part,
        traitId,
        displayName: trait.displayName,
        description: trait.description,
      },
    ];
  });
};

/**
 * Resolve the precomputed affinity summary for a wizard or warrior token.
 * Returns null when the token id is unknown or the collection has no
 * local affinity data.
 */
export const getLocalNftAffinity = (
  collection: LocalNftCollection,
  tokenId: string,
): LocalNftAffinity | null => {
  const numericTokenId = Number(tokenId);
  if (!Number.isInteger(numericTokenId)) return null;

  if (collection === "wizards") {
    const affinity = wizardAffinities[numericTokenId];
    if (!affinity) return null;

    return {
      affinityName: affinity.affinity?.name ?? "Unknown",
      collectionLabel: "wizard",
      traitsInAffinity: affinity.traitsInAffinity,
      numberOfTraits: affinity.numberOfTraits,
      attunement: affinity.attunement,
      maxTraitCount: WIZARD_MAX_AFFINITY_TRAITS,
      isMaxAffinity:
        affinity.traitsInAffinity === WIZARD_MAX_AFFINITY_TRAITS &&
        affinity.numberOfTraits === WIZARD_MAX_AFFINITY_TRAITS &&
        affinity.attunement === 100,
    };
  }

  if (collection === "souls") {
    const affinity = soulAffinities[numericTokenId];
    if (!affinity) return null;

    return {
      affinityName: affinity.affinityName ?? "Soul Affinity",
      collectionLabel: "soul",
      traitsInAffinity: affinity.traitsInAffinity,
      numberOfTraits: affinity.numberOfTraits,
      attunement: affinity.attunement,
      maxTraitCount: SOUL_MAX_AFFINITY_TRAITS,
      isMaxAffinity:
        affinity.traitsInAffinity === SOUL_MAX_AFFINITY_TRAITS &&
        affinity.numberOfTraits === SOUL_MAX_AFFINITY_TRAITS &&
        affinity.attunement === 100,
    };
  }

  const affinity = warriorAffinities[numericTokenId];
  if (!affinity) return null;

  return {
    affinityName: affinity.affinityName ?? "Unknown",
    collectionLabel: "warrior",
    traitsInAffinity: affinity.traitsInAffinity,
    numberOfTraits: affinity.numberOfTraits,
    attunement: affinity.attunement,
    maxTraitCount: WARRIOR_MAX_AFFINITY_TRAITS,
    isMaxAffinity:
      affinity.traitsInAffinity === WARRIOR_MAX_AFFINITY_TRAITS &&
      affinity.numberOfTraits === WARRIOR_MAX_AFFINITY_TRAITS &&
      affinity.attunement === 100,
  };
};
