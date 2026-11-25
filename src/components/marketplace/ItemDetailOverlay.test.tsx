import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemDetailOverlay } from "./ItemDetailOverlay";
import { collections } from "@/config/marketplace";
import type { MarketplaceItem } from "@/types/marketplace";

jest.mock("wagmi", () => ({
  useAccount: () => ({ isConnected: false }),
}));

jest.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => null,
}));

jest.mock("@/hooks/useMarketplace", () => ({
  useNFTOwnership: () => ({ isOwner: false }),
  useMarketplaceActions: () => ({
    buyNFT: jest.fn(),
    acceptOffer: jest.fn(),
    isProcessing: false,
    error: null,
  }),
}));

const item = (
  collection: MarketplaceItem["collection"],
  traits: { trait_type: string; value: string }[],
  identifier = "0",
): MarketplaceItem => ({
  collection,
  nft: {
    identifier,
    collection: collection.key,
    contract: collection.address,
    token_standard: "erc721",
    name: "Listed character",
    description: "",
    image_url: "",
    metadata_url: "",
    opensea_url: "https://opensea.io/item/0",
    updated_at: "",
    is_disabled: false,
    is_nsfw: false,
    traits,
  },
  listings: [],
  offers: [],
});

const renderOverlay = (marketplaceItem: MarketplaceItem) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ItemDetailOverlay
        item={marketplaceItem}
        isOpen
        onClose={() => undefined}
      />
    </QueryClientProvider>,
  );
};

it("uses local rarity for an OpenSea wizard instead of OpenSea trait names", async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      affinity: null,
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
    }),
  });

  renderOverlay(
    item(collections.wizards, [{ trait_type: "Head", value: "OpenSea label" }]),
  );

  expect(await screen.findByText("Illuminatus")).toBeInTheDocument();
  expect(screen.getByText("26")).toBeInTheDocument();
  expect(screen.getByText("0.26%")).toBeInTheDocument();
  expect(screen.queryByText("OpenSea label")).not.toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledWith(
    "/api/characters/wizards/0",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});

it("leaves OpenSea traits unchanged for collections without local ids", () => {
  globalThis.fetch = jest.fn();

  renderOverlay(
    item(collections.beasts, [{ trait_type: "Fur", value: "Moss" }]),
  );

  expect(screen.getByText("Moss")).toBeInTheDocument();
  expect(screen.queryByText("%", { exact: false })).not.toBeInTheDocument();
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

it("loads a soul listing from local metadata", async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      affinity: null,
      traits: [
        {
          part: "Familiar",
          partKey: "familiar",
          traitId: 94,
          displayName: "Local familiar",
          count: 4,
          total: 745,
        },
      ],
    }),
  });

  renderOverlay(
    item(
      collections.souls,
      [{ trait_type: "Familiar", value: "OpenSea familiar" }],
      "10",
    ),
  );

  expect(await screen.findByText("Local familiar")).toBeInTheDocument();
  expect(screen.getByText("0.54%")).toBeInTheDocument();
  expect(screen.queryByText("OpenSea familiar")).not.toBeInTheDocument();
  expect(globalThis.fetch).toHaveBeenCalledWith(
    "/api/characters/souls/10",
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});

it("prints the max affinity line with the singular collection label", async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      traits: [],
      affinity: {
        affinityName: "Wraith",
        collectionLabel: "wizard",
        traitsInAffinity: 5,
        numberOfTraits: 5,
        attunement: 100,
        maxTraitCount: 5,
        isMaxAffinity: true,
      },
    }),
  });

  renderOverlay(item(collections.wizards, []));

  expect(
    await screen.findByText(
      "Max affinity wizard: 5/5 traits and 100% attuned.",
    ),
  ).toBeInTheDocument();
});

it("falls back to OpenSea traits without chips when a soul is not in the local data", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => ({ error: "Unknown character" }),
  });
  globalThis.fetch = fetchMock;

  renderOverlay(
    item(collections.souls, [
      { trait_type: "Familiar", value: "OpenSea familiar" },
    ]),
  );

  expect(await screen.findByText("OpenSea familiar")).toBeInTheDocument();
  expect(screen.queryByText("%", { exact: false })).not.toBeInTheDocument();
  expect(
    screen.queryByText("Couldn't load character details."),
  ).not.toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("shows an error and retries when local character details fail to load", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ error: "Server error" }),
  });
  globalThis.fetch = fetchMock;

  renderOverlay(
    item(collections.souls, [
      { trait_type: "Familiar", value: "OpenSea familiar" },
    ]),
  );

  expect(
    await screen.findByText("Couldn't load character details."),
  ).toBeInTheDocument();
  expect(screen.queryByText("OpenSea familiar")).not.toBeInTheDocument();

  await userEvent.click(
    screen.getByRole("button", { name: "Retry character details" }),
  );
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
});
