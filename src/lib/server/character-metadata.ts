import "server-only";
import { wizardTraits, wizardTraitParts } from "@/data/wizardTraits";
import { warriorTraits, warriorTraitParts } from "@/data/warriorTraits";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";
import { getLocalNftTraits, getLocalNftAffinity } from "@/data/localNftPreview";
import {
  asLocalNftCollection,
  type LocalNftCollection,
  type LocalNftMetadata,
  type CollectionTraitOptions,
} from "@/types/nft-metadata";
import type { MarketplaceItem } from "@/types/marketplace";

export const withLocalTraitIds = (item: MarketplaceItem): MarketplaceItem => {
  const collection = asLocalNftCollection(item.collection.key);
  if (!collection) return item;
  const record =
    collection === "wizards"
      ? wizardsWithTraitsMap[item.nft.identifier]
      : warriorsWithTraitsMap[item.nft.identifier];
  if (!record) return item;
  const { idx: _idx, name: _name, ...localTraitIds } = record;
  return { ...item, nft: { ...item.nft, localTraitIds } };
};

export const getCollectionTraitOptions = (
  collection: LocalNftCollection,
): CollectionTraitOptions => {
  const parts = collection === "wizards" ? wizardTraitParts : warriorTraitParts;
  const traits = collection === "wizards" ? wizardTraits : warriorTraits;
  return Object.fromEntries(
    parts.map((part) => [
      part,
      traits
        .filter((trait) => trait.part === part)
        .map((trait) => ({ value: trait.idx, label: trait.displayName }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    ]),
  );
};

export const getLocalNftMetadata = (
  collection: LocalNftCollection,
  tokenId: string,
): LocalNftMetadata | null => {
  if (!/^(0|[1-9]\d*)$/.test(tokenId)) return null;
  const record =
    collection === "wizards"
      ? wizardsWithTraitsMap[tokenId]
      : warriorsWithTraitsMap[tokenId];
  if (!record) return null;
  return {
    traits: getLocalNftTraits(collection, tokenId),
    affinity: getLocalNftAffinity(collection, tokenId),
  };
};
