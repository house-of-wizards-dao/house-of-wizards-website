import "server-only";
import { wizardTraits, wizardTraitParts } from "@/data/wizardTraits";
import { warriorTraits, warriorTraitParts } from "@/data/warriorTraits";
import { soulTraits, soulTraitParts } from "@/data/soulTraits";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";
import { soulsWithTraitsMap } from "@/data/soulsWithTraitsMap";
import { traitRarity } from "@/data/traitRarity";
import { getLocalNftTraits, getLocalNftAffinity } from "@/data/localNftPreview";
import { withTraitRarity } from "@/lib/with-trait-rarity";
import { localCharacterCollection } from "@/lib/local-character-contract";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { GalleryNFT } from "@/types/gallery";
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
  if (collection === "souls") {
    const soul = soulsWithTraitsMap[item.nft.identifier];
    if (!soul) return item;
    return {
      ...item,
      nft: {
        ...item.nft,
        localTraitIds: {
          background: soul.background,
          body: soul.body,
          familiar: soul.familiar,
          head: soul.head,
          prop: soul.prop,
          rune: soul.rune,
          undesirable: soul.undesirable,
        },
      },
    };
  }
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
  const parts =
    collection === "wizards"
      ? wizardTraitParts
      : collection === "warriors"
        ? warriorTraitParts
        : soulTraitParts;
  const traits =
    collection === "wizards"
      ? wizardTraits
      : collection === "warriors"
        ? warriorTraits
        : soulTraits;

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
      : collection === "warriors"
        ? warriorsWithTraitsMap[tokenId]
        : soulsWithTraitsMap[tokenId];
  if (!record) return null;
  return {
    traits: withTraitRarity(
      getLocalNftTraits(collection, tokenId),
      traitRarity[collection],
      collection,
    ),
    affinity: getLocalNftAffinity(collection, tokenId),
  };
};

export const withLocalCharacter = (nft: OpenSeaNFT): GalleryNFT => {
  const collection = localCharacterCollection(nft.contract);
  const metadata = collection
    ? getLocalNftMetadata(collection, nft.identifier)
    : null;
  if (!metadata) return { ...nft, character: null };

  return {
    ...nft,
    character: {
      ...metadata,
      traits: metadata.traits.map(
        ({ description: _description, ...trait }) => trait,
      ),
    },
  };
};
