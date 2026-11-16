import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useWalletNFTs } from "./useWalletNFTs";

const setup = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper, client };
};

afterEach(() => jest.restoreAllMocks());

it("normalizes and deduplicates wallets without refetching for equivalent arrays", async () => {
  const fetchMock = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ wizards: [] }) });
  global.fetch = fetchMock;
  const { wrapper, client } = setup();
  const { result, rerender, unmount } = renderHook(
    ({ wallets }) => useWalletNFTs(wallets),
    { initialProps: { wallets: [" A.ETH ", "b.eth", "a.eth"] }, wrapper },
  );
  await waitFor(() => expect(result.current.data).toEqual({ wizards: [] }));
  rerender({ wallets: ["b.eth", "a.eth"] });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(
    "/api/nfts/wallets?wallets=a.eth&wallets=b.eth",
    { signal: expect.any(AbortSignal) },
  );
  unmount();
  client.clear();
});

it("aborts stale requests and clears data when wallets are removed", async () => {
  const signals: AbortSignal[] = [];
  let resolveFirst: ((value: unknown) => void) | undefined;
  global.fetch = jest.fn().mockImplementation((_url, options: RequestInit) => {
    if (options.signal) signals.push(options.signal);
    return new Promise((resolve) => {
      resolveFirst = resolve;
    });
  });
  const { wrapper, client } = setup();
  const { result, rerender, unmount } = renderHook(
    ({ wallets }) => useWalletNFTs(wallets),
    { initialProps: { wallets: ["a.eth"] }, wrapper },
  );
  await waitFor(() => expect(signals).toHaveLength(1));
  rerender({ wallets: [] });
  expect(signals[0].aborted).toBe(true);
  await act(async () =>
    resolveFirst?.({ ok: true, json: async () => ({ stale: [] }) }),
  );
  expect(result.current).toMatchObject({
    data: null,
    loading: false,
    error: null,
  });
  unmount();
  client.clear();
});
