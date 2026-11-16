jest.mock("server-only", () => ({}));
import {
  getLocalNftMetadata,
  getCollectionTraitOptions,
  withLocalTraitIds,
} from "./character-metadata";
import { collections } from "@/config/marketplace";
import type { MarketplaceItem } from "@/types/marketplace";

it("serves one character's metadata and rejects malformed or unknown IDs", () => {
  expect(getLocalNftMetadata("wizards", "0")?.traits.length).toBeGreaterThan(0);
  expect(getLocalNftMetadata("warriors", "0")?.affinity).toBeTruthy();
  for (const id of ["-1", "1.5", "01", "constructor", "999999999"])
    expect(getLocalNftMetadata("wizards", id)).toBeNull();
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
