import "server-only";
import { TokenboundClient } from "@tokenbound/sdk";
import { getAddress } from "viem";
import type {
  CharacterTrait,
  CharacterAffinity,
  CharacterPageData,
} from "@/types/character";
import { getCollectionName } from "@/data/traitUtilities";
import { soulAffinities } from "@/data/soulAffinity";
import { soulsWithTraitsMap } from "@/data/soulsWithTraitsMap";
import { warriorAffinities } from "@/data/warriorAffinity";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";
import { wizardAffinities } from "@/data/wizardAffinity";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import { soulTraits, type Trait as SoulTrait } from "@/data/soulTraits";
import {
  warriorTraits,
  type Trait as WarriorTrait,
} from "@/data/warriorTraits";
import { wizardTraits, type Trait as WizardTrait } from "@/data/wizardTraits";
import { getCharacterName } from "@/data/traitUtilities";

const emptyTraitId = 7777;
const wizardDisplayParts = [
  "head",
  "body",
  "prop",
  "familiar",
  "rune",
] as const;
const warriorDisplayParts = [
  "head",
  "body",
  "weapon",
  "shield",
  "companion",
  "rune",
] as const;
const soulDisplayParts = [
  "head",
  "body",
  "prop",
  "familiar",
  "rune",
  "undesirable",
] as const;
const soulTraitsById = new Map<number, SoulTrait>(
  soulTraits.map((trait) => [trait.idx, trait]),
);
const warriorTraitsById = new Map<number, WarriorTrait>(
  warriorTraits.map((trait) => [trait.idx, trait]),
);
const wizardTraitsById = new Map<number, WizardTrait>(
  wizardTraits.map((trait) => [trait.idx, trait]),
);

const formatTraitPart = (part: string) =>
  part === "companion"
    ? "Familiar"
    : part.charAt(0).toUpperCase() + part.slice(1);

const getCharacterTraits = (
  collectionName: string,
  tokenId: string,
): CharacterTrait[] => {
  if (collectionName === "Warriors") {
    const warrior = warriorsWithTraitsMap[tokenId];
    if (!warrior) return [];

    return warriorDisplayParts.flatMap((part) => {
      const traitId = warrior[part];
      const trait = warriorTraitsById.get(traitId);
      if (traitId === emptyTraitId || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  if (collectionName === "Wizards") {
    const wizard = wizardsWithTraitsMap[tokenId];
    if (!wizard) return [];

    return wizardDisplayParts.flatMap((part) => {
      const traitId = wizard[part];
      const trait = wizardTraitsById.get(traitId);
      if (traitId === emptyTraitId || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  if (collectionName === "Souls") {
    const soul = soulsWithTraitsMap[tokenId];
    if (!soul) return [];

    return soulDisplayParts.flatMap((part) => {
      const traitId = soul[part];
      const trait = soulTraitsById.get(traitId);
      if (traitId === emptyTraitId || !trait) return [];

      return [
        {
          part: formatTraitPart(part),
          displayName: trait.displayName,
          description: trait.description,
        },
      ];
    });
  }

  return [];
};

const buildCharacterAffinity = (
  collectionName: string,
  tokenId: string,
): CharacterAffinity | null => {
  const numericTokenId = Number(tokenId);
  if (!Number.isInteger(numericTokenId)) return null;

  if (collectionName === "Wizards") {
    const affinity = wizardAffinities[numericTokenId];
    if (!affinity) return null;

    const maxTraitCount = 5;

    return {
      affinityName: affinity.affinity?.name ?? "Unknown",
      collectionLabel: "wizard",
      traitsInAffinity: affinity.traitsInAffinity,
      numberOfTraits: affinity.numberOfTraits,
      attunement: affinity.attunement,
      maxTraitCount,
      isMaxAffinity:
        affinity.traitsInAffinity === maxTraitCount &&
        affinity.numberOfTraits === maxTraitCount &&
        affinity.attunement === 100,
    };
  }

  if (collectionName === "Warriors") {
    const affinity = warriorAffinities[numericTokenId];
    if (!affinity) return null;

    const maxTraitCount = 6;

    return {
      affinityName: affinity.affinityName ?? "Unknown",
      collectionLabel: "warrior",
      traitsInAffinity: affinity.traitsInAffinity,
      numberOfTraits: affinity.numberOfTraits,
      attunement: affinity.attunement,
      maxTraitCount,
      isMaxAffinity:
        affinity.traitsInAffinity === maxTraitCount &&
        affinity.numberOfTraits === maxTraitCount &&
        affinity.attunement === 100,
    };
  }

  if (collectionName === "Souls") {
    const affinity = soulAffinities[numericTokenId];
    if (!affinity) return null;

    const maxTraitCount = 5;

    return {
      affinityName: affinity.affinityName ?? "Soul Affinity",
      collectionLabel: "soul",
      traitsInAffinity: affinity.traitsInAffinity,
      numberOfTraits: affinity.numberOfTraits,
      attunement: affinity.attunement,
      maxTraitCount,
      isMaxAffinity:
        affinity.traitsInAffinity === maxTraitCount &&
        affinity.numberOfTraits === maxTraitCount &&
        affinity.attunement === 100,
    };
  }

  return null;
};

export const getCharacterPageData = (
  contract: string,
  tokenId: string,
): CharacterPageData => {
  const collectionName = getCollectionName(contract);
  return {
    backpackAccount: new TokenboundClient({ chainId: 1 }).getAccount({
      tokenContract: getAddress(contract.toLowerCase()),
      tokenId,
    }),
    contract,
    tokenId,
    collectionName,
    characterName: getCharacterName(contract, tokenId),
    characterTraits: getCharacterTraits(collectionName, tokenId),
    characterAffinity: buildCharacterAffinity(collectionName, tokenId),
  };
};
