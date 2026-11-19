import { frwcAddresses } from "@/config/addresses";
import { fetchNFTsForWallets } from "./opensea-nfts";

const mockGetNFTs = jest.fn();
jest.mock("@opensea/sdk", () => ({
  Chain: { Mainnet: "ethereum" },
  OpenSeaSDK: jest.fn().mockImplementation(() => ({
    api: { nfts: { getNFTsByAccount: mockGetNFTs } },
  })),
}));
jest.mock("ethers", () => ({ JsonRpcProvider: jest.fn() }));
jest.mock("@/lib/logger", () => ({
  logger: { error: jest.fn(), debug: jest.fn() },
}));

const wallet = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const originalApiKey = process.env.OPENSEA_API_KEY;
const wizard = {
  identifier: "44",
  collection: "forgottenruneswizardscult",
  contract: frwcAddresses.wizards,
  tokenStandard: "erc721",
  name: "Wild Mage Lumos",
  imageUrl: "https://example.com/wizard44.png",
};

beforeEach(() => {
  process.env.OPENSEA_API_KEY = "test-only-key";
  mockGetNFTs.mockReset();
});
afterEach(() => {
  if (originalApiKey === undefined) delete process.env.OPENSEA_API_KEY;
  else process.env.OPENSEA_API_KEY = originalApiKey;
});

it("reports missing configuration instead of returning an empty wallet", async () => {
  delete process.env.OPENSEA_API_KEY;
  await expect(fetchNFTsForWallets([wallet])).rejects.toThrow(
    "OpenSea API key is not configured.",
  );
  expect(mockGetNFTs).not.toHaveBeenCalled();
});

it("propagates provider failures so the API can return an error", async () => {
  const failure = new Error("OpenSea unavailable");
  mockGetNFTs.mockRejectedValue(failure);
  await expect(fetchNFTsForWallets([wallet])).rejects.toBe(failure);
});

it("does not present an incomplete inventory when a later page fails", async () => {
  mockGetNFTs
    .mockResolvedValueOnce({ nfts: [wizard], next: "page-2" })
    .mockRejectedValueOnce(new Error("Rate limited"));
  await expect(fetchNFTsForWallets([wallet])).rejects.toThrow("Rate limited");
});

it("allows a successfully loaded wallet to have no characters", async () => {
  mockGetNFTs.mockResolvedValue({ nfts: [], next: null });
  expect(await fetchNFTsForWallets([wallet])).toEqual(new Map());
});

it("preserves character names and images from the provider response", async () => {
  mockGetNFTs.mockResolvedValue({ nfts: [wizard], next: null });
  const wallets = await fetchNFTsForWallets([wallet]);
  expect(wallets.get(wallet)?.get(frwcAddresses.wizards.toLowerCase())).toEqual(
    [
      expect.objectContaining({
        identifier: "44",
        name: "Wild Mage Lumos",
        image_url: "https://example.com/wizard44.png",
      }),
    ],
  );
});
