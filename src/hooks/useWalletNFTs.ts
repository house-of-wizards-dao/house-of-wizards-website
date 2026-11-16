"use client";

import { useQuery } from "@tanstack/react-query";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";

export type WalletNFTsByCollection = Record<string, OpenSeaNFT[]>;

export const useWalletNFTs = (walletInputs: string[]) => {
  const wallets = [
    ...new Set(
      walletInputs.map((wallet) => wallet.trim().toLowerCase()).filter(Boolean),
    ),
  ].sort();
  const query = useQuery({
    queryKey: ["wallet-nfts", wallets],
    enabled: wallets.length > 0,
    staleTime: 60_000,
    queryFn: async ({ signal }): Promise<WalletNFTsByCollection> => {
      const params = new URLSearchParams();
      wallets.forEach((wallet) => params.append("wallets", wallet));
      const response = await fetch(`/api/nfts/wallets?${params}`, { signal });
      if (!response.ok)
        throw new Error(`Failed to fetch NFTs: ${response.statusText}`);
      return response.json();
    },
  });
  return {
    data: wallets.length ? (query.data ?? null) : null,
    loading: wallets.length > 0 && query.isPending,
    error: query.error,
  };
};
