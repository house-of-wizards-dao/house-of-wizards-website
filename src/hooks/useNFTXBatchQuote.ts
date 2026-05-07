"use client";

import { useQuery } from "@tanstack/react-query";
import type { CollectionKey } from "@/types/marketplace";

/**
 * Quote shape returned by /api/marketplace/nftx/quote
 */
export type NFTXBatchQuote = {
  count: number;
  totalWei: string;
  totalEth: string;
  marginalNextWei: string;
  marginalNextEth: string;
  perNftVTokenWei: string;
};

const fetchNFTXBatchQuote = async (
  collection: CollectionKey,
  count: number,
): Promise<NFTXBatchQuote> => {
  const response = await fetch("/api/marketplace/nftx/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collection, count }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch NFTX batch quote");
  }
  return data.quote as NFTXBatchQuote;
};

type UseNFTXBatchQuoteOptions = {
  /** When false, the hook stays disabled (e.g. for collections without a vault) */
  enabled?: boolean;
};

/**
 * Live atomic NFTX batch quote keyed on (collection, count).
 *
 * - When `count` is 0, the hook still issues a request so the UI can show the
 *   marginal "next item" price for an empty cart (i.e. the same as the per-item
 *   price baked into card listings).
 * - Refetches automatically as the cart count changes since `count` is part of
 *   the query key.
 */
export const useNFTXBatchQuote = (
  collection: CollectionKey | null,
  count: number,
  options?: UseNFTXBatchQuoteOptions,
) => {
  const enabled = (options?.enabled ?? true) && !!collection;

  const query = useQuery({
    queryKey: ["marketplace", "nftx-quote", collection, count],
    queryFn: () => fetchNFTXBatchQuote(collection!, count),
    enabled,
    staleTime: 30_000,
    gcTime: 60_000,
  });

  return {
    quote: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};
