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
const EMPTY_TRAIT_ID = 7777;

const WIZARD_DISPLAY_PARTS = [
  "head",
  "body",
  "prop",
  "familiar",
  "rune",
] as const;

const WARRIOR_DISPLAY_PARTS = [
  "head",
  "body",
  "weapon",
  "shield",
  "companion",
  "rune",
] as const;

const WIZARD_MAX_AFFINITY_TRAITS = 5;
const WARRIOR_MAX_AFFINITY_TRAITS = 6;

const wizardTraitsById = new Map<number, WizardTrait>(
  wizardTraits.map((trait) => [trait.idx, trait]),
);

const warriorTraitsById = new Map<number, WarriorTrait>(
  warriorTraits.map((trait) => [trait.idx, trait]),
);

export type LocalNftCollection = "wizards" | "warriors";

export type LocalNftTrait = {
  part: string;
  displayName: string;
  description?: string;
};

export type LocalNftAffinity = {
  affinityName: string;
  collectionLabel: LocalNftCollection;
  traitsInAffinity: number;
  numberOfTraits: number;
  attunement: number;
  maxTraitCount: number;
  isMaxAffinity: boolean;
};

const formatTraitPart = (part: string): string =>
  part === "companion"
    ? "Familiar"
    : part.charAt(0).toUpperCase() + part.slice(1);

/**
 * Resolve display traits for a wizard or warrior token from the local
 * trait maps. Returns an empty array for unknown collections or token IDs.
 */
export const getLocalNftTraits = (
  collection: LocalNftCollection,
  tokenId: string,
): LocalNftTrait[] => {
  if (collection === "wizards") {
    const wizard = wizardsWithTraitsMap[tokenId];
    if (!wizard) return [];

    return WIZARD_DISPLAY_PARTS.flatMap((part) => {
      const traitId = wizard[part];
      const trait = wizardTraitsById.get(traitId);
      if (traitId === EMPTY_TRAIT_ID || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  const warrior = warriorsWithTraitsMap[tokenId];
  if (!warrior) return [];

  return WARRIOR_DISPLAY_PARTS.flatMap((part) => {
    const traitId = warrior[part];
    const trait = warriorTraitsById.get(traitId);
    if (traitId === EMPTY_TRAIT_ID || !trait) return [];

    return [
      {
        part: formatTraitPart(part),
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
      collectionLabel: "wizards",
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

  const affinity = warriorAffinities[numericTokenId];
  if (!affinity) return null;

  return {
    affinityName: affinity.affinityName ?? "Unknown",
    collectionLabel: "warriors",
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

/**
 * Narrow a marketplace collection key to the subset of collections that have
 * locally-shipped trait + affinity data. Returns null otherwise.
 */
export const asLocalNftCollection = (
  collectionKey: string,
): LocalNftCollection | null => {
  if (collectionKey === "wizards" || collectionKey === "warriors") {
    return collectionKey;
  }
  return null;
};
