import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useNFTXListings } from "@/hooks/useMarketplace";

jest.mock("wagmi", () => ({}));
jest.mock("@opensea/sdk/viem", () => ({}));

const fetchMock = jest.fn();

beforeEach(() => {
  global.fetch = fetchMock;
  fetchMock.mockReset();
});

it("refreshes fresh listings and active batch quotes while showing loading", async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      listings: [{ nft: { identifier: "1" } }],
      hasVault: true,
    }),
  });
  const invalidate = jest.spyOn(client, "invalidateQueries");
  const { result } = renderHook(() => useNFTXListings("wizards"), { wrapper });
  await waitFor(() => expect(result.current.items).toHaveLength(1));

  let finishRefresh: (() => void) | undefined;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishRefresh = () =>
          resolve({
            ok: true,
            json: async () => ({ listings: [], hasVault: true }),
          });
      }),
  );
  let refresh: Promise<void>;
  act(() => {
    refresh = result.current.refresh();
  });
  await waitFor(() => expect(result.current.isLoading).toBe(true));
  expect(fetchMock).toHaveBeenLastCalledWith(
    "/api/marketplace/nftx?collection=wizards&refresh=true",
    { cache: "no-store" },
  );
  await act(async () => {
    finishRefresh?.();
    await refresh;
  });
  await waitFor(() => expect(result.current.items).toEqual([]));
  expect(result.current.isLoading).toBe(false);
  expect(invalidate).toHaveBeenCalledWith({
    queryKey: ["marketplace", "nftx-quote", "wizards"],
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  client.clear();
});
