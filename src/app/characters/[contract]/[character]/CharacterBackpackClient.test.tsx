import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { frwcAddresses } from "@/config/addresses";
import type { CharacterPageData } from "@/types/character";
import CharacterBackpackClient from "./CharacterBackpackClient";

jest.mock("wagmi", () => ({
  useAccount: () => ({ isConnected: false }),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: () => null,
  defaultUrlTransform: (url: string) => url,
}));

const page = (): CharacterPageData => ({
  contract: frwcAddresses.wizards,
  backpackAccount: "0x0000000000000000000000000000000000000001",
  tokenId: "0",
  collectionName: "Wizards",
  characterName: "Holy Arcanist",
  characterAffinity: null,
  characterTraits: [
    {
      part: "Head",
      partKey: "head",
      traitId: 170,
      displayName: "Illuminatus",
      count: 26,
      total: 10000,
    },
  ],
});

it("renders a rarity chip for each character trait", async () => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ entries: [] }),
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={client}>
      <CharacterBackpackClient {...page()} />
    </QueryClientProvider>,
  );

  expect(screen.getByText("Illuminatus")).toBeInTheDocument();
  expect(screen.getByText("26")).toBeInTheDocument();
  expect(screen.getByText("0.26%")).toBeInTheDocument();
});
