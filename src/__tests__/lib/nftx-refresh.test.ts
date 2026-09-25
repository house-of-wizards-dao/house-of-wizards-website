import { fetchNFTXListings, nftxVaults } from "@/lib/nftx";

jest.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => Promise<unknown>) => {
    const cache = new Map<string, Promise<unknown>>();
    return (...args: unknown[]) => {
      const key = JSON.stringify(args);
      if (!cache.has(key)) cache.set(key, fn(...args));
      return cache.get(key);
    };
  },
}));
jest.mock("viem", () => ({
  createPublicClient: () => ({
    readContract: async ({ functionName }: { functionName: string }) =>
      functionName === "getAmountsOut" || functionName === "getAmountsIn"
        ? [1000000000000000000n, 1000000000000000000n]
        : 0n,
  }),
  http: jest.fn(),
}));
jest.mock("@/lib/marketplace", () => ({
  collections: {
    wizards: { slug: "wizards", address: "0xnft", name: "Wizards" },
  },
}));
jest.mock("@/data/wizardsWithTraits", () => ({ wizardsWithTraits: {} }));
jest.mock("@/data/warriorsWithTraits", () => ({ warriorsWithTraits: {} }));

it("bypasses cached vault holdings on manual refresh", async () => {
  expect(nftxVaults.wizards).toBeDefined();
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ nfts: [{ contract: "0xnft", identifier: "1" }] }),
  });
  global.fetch = fetchMock;
  const first = await fetchNFTXListings("wizards");
  expect(first.map((item) => item.nft.identifier)).toEqual(["1"]);
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ nfts: [{ contract: "0xnft", identifier: "2" }] }),
  });
  const cached = await fetchNFTXListings("wizards");
  expect(cached.map((item) => item.nft.identifier)).toEqual(["1"]);
  const refreshed = await fetchNFTXListings("wizards", true);
  expect(refreshed.map((item) => item.nft.identifier)).toEqual(["2"]);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock).toHaveBeenLastCalledWith(
    expect.any(String),
    expect.objectContaining({ cache: "no-store" }),
  );
});
