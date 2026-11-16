import { frwcAddresses } from "@/config/addresses";
import type { CollectionKey, CollectionInfo } from "@/types/marketplace";

export const marketplaceConfig = { offersEnabled: false } as const;

export const collections: Record<CollectionKey, CollectionInfo> = {
  wizards: {
    key: "wizards",
    name: "Forgotten Runes Wizards Cult",
    address: frwcAddresses.wizards,
    slug: "forgottenruneswizardscult",
    hasLocalMetadata: true,
  },
  warriors: {
    key: "warriors",
    name: "Forgotten Runes Warriors Guild",
    address: frwcAddresses.warriors,
    slug: "forgottenruneswarriorsguild",
    hasLocalMetadata: true,
  },
  souls: {
    key: "souls",
    name: "Forgotten Souls",
    address: frwcAddresses.souls,
    slug: "forgottensouls",
    hasLocalMetadata: false,
  },
  beasts: {
    key: "beasts",
    name: "Forgotten Runes Beasts",
    address: frwcAddresses.beasts,
    slug: "forgottenrunesbeasts",
    hasLocalMetadata: false,
  },
  ponies: {
    key: "ponies",
    name: "Forgotten Runes Ponies",
    address: frwcAddresses.ponies,
    slug: "forgottenrunesponies",
    hasLocalMetadata: false,
  },
  spawn: {
    key: "spawn",
    name: "Forgotten Runes Beast Spawn",
    address: frwcAddresses.spawn,
    slug: "forgottenrunesbeastspawn",
    hasLocalMetadata: false,
  },
  veil: {
    key: "veil",
    name: "The Forgotten Runes Infinity Veil",
    address: frwcAddresses.veil,
    slug: "infinityveil",
    hasLocalMetadata: false,
  },
  locks: {
    key: "locks",
    name: "Forgotten Runes Gate To The Seventh Realm",
    address: frwcAddresses.locks,
    slug: "forgottenrunesgatetotheseventhrealm",
    hasLocalMetadata: false,
  },
  athenaeum: {
    key: "athenaeum",
    name: "Forgotten Runes Athenaeum",
    address: frwcAddresses.athenaeum,
    slug: "athenaeum",
    hasLocalMetadata: false,
  },
  impBox: {
    key: "impBox",
    name: "Nightmare Imp's Treat Boxes",
    address: frwcAddresses.impBox,
    slug: "nightmareimpstreatboxes",
    hasLocalMetadata: false,
  },
};

/**
 * Get collection info by key
 */
export const getCollection = (key: CollectionKey): CollectionInfo => {
  return collections[key];
};
