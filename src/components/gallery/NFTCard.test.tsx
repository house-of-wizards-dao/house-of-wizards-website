import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { frwcAddresses } from "@/config/addresses";
import type { GalleryNFT } from "@/types/gallery";
import type { LocalNftMetadata } from "@/types/nft-metadata";
import { NFTCard } from "./NFTCard";

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    writable: true,
    value: MockIntersectionObserver,
  });
});

const character: LocalNftMetadata = {
  traits: [
    {
      part: "Head",
      partKey: "head",
      traitId: 170,
      displayName: "Illuminatus",
      count: 26,
      total: 10000,
    },
  ],
  affinity: {
    affinityName: "Wraith",
    collectionLabel: "wizard",
    traitsInAffinity: 3,
    numberOfTraits: 3,
    attunement: 100,
    maxTraitCount: 5,
    isMaxAffinity: false,
  },
};

const base = (contract: string) => ({
  identifier: "0",
  collection: "test",
  contract,
  token_standard: "erc721",
  name: "Holy Arcanist",
  description: "",
  image_url: "https://example.com/0.png",
  metadata_url: "",
  opensea_url: "https://opensea.io/item/0",
  updated_at: "",
  is_disabled: false,
  is_nsfw: false,
});

const localNft = (contract: string): GalleryNFT => ({
  ...base(contract),
  character,
});

const openSeaNft = (contract: string): GalleryNFT => ({
  ...base(contract),
  character: null,
});

it.each([
  ["wizards", frwcAddresses.wizards],
  ["warriors", frwcAddresses.warriors],
  ["souls", frwcAddresses.souls],
])("opens %s with a local character in an overlay", (_name, contract) => {
  render(<NFTCard nft={localNft(contract)} contract={contract} />);

  expect(
    screen.getByRole("button", { name: "Holy Arcanist" }),
  ).toBeInTheDocument();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});

it("links to OpenSea when the token has no local character", () => {
  render(
    <NFTCard
      nft={openSeaNft(frwcAddresses.wizards)}
      contract={frwcAddresses.wizards}
    />,
  );

  expect(screen.getByRole("link", { name: "Holy Arcanist" })).toHaveAttribute(
    "href",
    "https://opensea.io/item/0",
  );
});

it("keeps other gallery collections linked to OpenSea", () => {
  render(
    <NFTCard
      nft={openSeaNft(frwcAddresses.beasts)}
      contract={frwcAddresses.beasts}
    />,
  );

  expect(screen.getByRole("link", { name: "Holy Arcanist" })).toHaveAttribute(
    "href",
    "https://opensea.io/item/0",
  );
});

it("shows traits, rarity, and affinity as soon as the overlay opens", async () => {
  render(
    <NFTCard
      nft={localNft(frwcAddresses.wizards)}
      contract={frwcAddresses.wizards}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Holy Arcanist" }));

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText("Illuminatus")).toBeInTheDocument();
  expect(screen.getByText("0.26%")).toBeInTheDocument();
  expect(screen.getByText("Wraith")).toBeInTheDocument();
  expect(screen.queryByText("Loading traits...")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "View character" })).toHaveAttribute(
    "href",
    `/characters/${frwcAddresses.wizards}/0`,
  );
  expect(screen.getByRole("link", { name: "View on OpenSea" })).toHaveAttribute(
    "href",
    "https://opensea.io/item/0",
  );
});
