jest.mock("server-only", () => ({}));
import {
  getLocalNftMetadata,
  getCollectionTraitOptions,
  withLocalCharacter,
  withLocalTraitIds,
} from "./character-metadata";
import { frwcAddresses } from "@/config/addresses";
import { collections } from "@/config/marketplace";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import { traitRarity } from "@/data/traitRarity";
import type { MarketplaceItem } from "@/types/marketplace";
import { asLocalNftCollection } from "@/types/nft-metadata";

it("serves one character's metadata and rejects malformed or unknown IDs", () => {
  expect(getLocalNftMetadata("wizards", "0")?.traits.length).toBeGreaterThan(0);
  expect(getLocalNftMetadata("warriors", "0")?.affinity).toBeTruthy();
  for (const id of ["-1", "1.5", "01", "constructor", "999999999"])
    expect(getLocalNftMetadata("wizards", id)).toBeNull();
});

it("returns the trait id and that id's rarity for local characters", () => {
  const wizard = getLocalNftMetadata("wizards", "0");
  const head = wizard?.traits.find((trait) => trait.partKey === "head");
  const warrior = getLocalNftMetadata("warriors", "0");
  const companion = warrior?.traits.find(
    (trait) => trait.partKey === "companion",
  );

  expect(head?.traitId).toBe(170);
  expect(head?.displayName).toBe("Illuminatus");
  expect(head?.count).toBe(traitRarity.wizards.parts.head["170"]);
  expect(head?.total).toBe(10000);
  expect(companion?.part).toBe("Companion");
  expect(companion?.traitId).toBe(198);
  expect(companion?.count).toBe(traitRarity.warriors.parts.companion["198"]);
});

it("keeps trait filters usable without sending the whole character database", () => {
  const options = getCollectionTraitOptions("wizards");
  expect(options.head.length).toBeGreaterThan(0);
  expect(options.head).toEqual(
    [...options.head].sort((a, b) => a.label.localeCompare(b.label)),
  );
  const item: MarketplaceItem = {
    collection: collections.wizards,
    nft: {
      identifier: "0",
      collection: "wizards",
      contract: collections.wizards.address,
      token_standard: "erc721",
      name: "Wizard",
      description: "",
      image_url: "",
      metadata_url: "",
      opensea_url: "",
      updated_at: "",
      is_disabled: false,
      is_nsfw: false,
    },
    listings: [],
    offers: [],
  };
  const result = withLocalTraitIds(item);
  expect(result.nft.localTraitIds?.head).toEqual(expect.any(Number));
  expect(item.nft.localTraitIds).toBeUndefined();
  expect(JSON.stringify(result).length).toBeLessThan(1500);
});

it("serves soul traits by id and omits OpenSea-only fields", () => {
  expect(asLocalNftCollection("souls")).toBe("souls");
  expect(getLocalNftMetadata("souls", "0")).toBeNull();

  const soul = getLocalNftMetadata("souls", "10");
  const head = soul?.traits.find((trait) => trait.partKey === "head");

  expect(head?.traitId).toBe(150);
  expect(head?.count).toBe(traitRarity.souls.parts.head["150"]);
  expect(head?.total).toBe(traitRarity.souls.total);
  expect(soul?.affinity?.affinityName).toBe("Soul Affinity");
  expect(soul?.affinity?.attunement).toBe(40);

  const item: MarketplaceItem = {
    collection: collections.souls,
    nft: {
      identifier: "10",
      collection: "souls",
      contract: collections.souls.address,
      token_standard: "erc721",
      name: "Soul",
      description: "",
      image_url: "",
      metadata_url: "",
      opensea_url: "",
      updated_at: "",
      is_disabled: false,
      is_nsfw: false,
    },
    listings: [],
    offers: [],
  };
  const result = withLocalTraitIds(item);

  expect(result.nft.localTraitIds?.head).toBe(150);
  expect(result.nft.localTraitIds).not.toHaveProperty("transmutedFrom");
  expect(result.nft.localTraitIds).not.toHaveProperty("burnOrder");
});

it("labels affinity with the singular collection name", () => {
  expect(getLocalNftMetadata("wizards", "0")?.affinity).toEqual({
    affinityName: "Wraith",
    collectionLabel: "wizard",
    traitsInAffinity: 3,
    numberOfTraits: 3,
    attunement: 100,
    maxTraitCount: 5,
    isMaxAffinity: false,
  });
  expect(getLocalNftMetadata("warriors", "0")?.affinity?.collectionLabel).toBe(
    "warrior",
  );
  expect(getLocalNftMetadata("souls", "10")?.affinity?.collectionLabel).toBe(
    "soul",
  );
});

const walletNft = (contract: string, identifier: string): OpenSeaNFT => ({
  identifier,
  collection: "test",
  contract,
  token_standard: "erc721",
  name: "Character",
  description: "",
  image_url: "",
  metadata_url: "",
  opensea_url: "",
  updated_at: "",
  is_disabled: false,
  is_nsfw: false,
});

it("attaches local traits without descriptions to gallery NFTs", () => {
  const wizard = withLocalCharacter(walletNft(frwcAddresses.wizards, "0"));
  const head = wizard.character?.traits.find(
    (trait) => trait.partKey === "head",
  );

  expect(head).toEqual({
    part: "Head",
    partKey: "head",
    traitId: 170,
    displayName: "Illuminatus",
    count: traitRarity.wizards.parts.head["170"],
    total: traitRarity.wizards.total,
  });
  expect(wizard.character?.traits.some((trait) => "description" in trait)).toBe(
    false,
  );
  expect(wizard.character?.affinity?.affinityName).toBe("Wraith");
});

it("leaves non-local and unknown tokens without a character", () => {
  expect(
    withLocalCharacter(walletNft(frwcAddresses.beasts, "0")).character,
  ).toBeNull();
  expect(
    withLocalCharacter(walletNft(frwcAddresses.wizards, "999999")).character,
  ).toBeNull();
});

it("keeps a warrior's gallery character small", () => {
  const warrior = withLocalCharacter(walletNft(frwcAddresses.warriors, "0"));

  expect(JSON.stringify(warrior.character).length).toBeLessThan(1500);
});
