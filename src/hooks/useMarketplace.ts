"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";
import type {
  CollectionKey,
  MarketplaceItem,
  CollectionInfo,
  Listing,
  Offer,
  NFTXListing,
} from "@/types/marketplace";

// ============================================================================
// API Fetcher Functions
// ============================================================================

/**
 * Fetch OpenSea marketplace listings for a collection
 */
async function fetchMarketplaceListings(
  collection: CollectionKey,
  limit: number,
  cursor?: string,
): Promise<{
  listings: MarketplaceItem[];
  collection: CollectionInfo;
  next: string | null;
}> {
  const params = new URLSearchParams({
    collection,
    limit: String(limit),
  });
  if (cursor) {
    params.set("next", cursor);
  }

  const response = await fetch(`/api/marketplace/listings?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch listings");
  }

  return data;
}

/**
 * Fetch NFT details with offers
 */
async function fetchNFTDetails(
  collection: CollectionKey,
  tokenId: string,
): Promise<MarketplaceItem> {
  const params = new URLSearchParams({ collection, tokenId });
  const response = await fetch(`/api/marketplace/nft?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch NFT details");
  }

  return data.item;
}

/**
 * Fetch NFTX pool listings for a collection
 */
async function fetchNFTXListings(collection: CollectionKey): Promise<{
  listings: MarketplaceItem[];
  vault: NFTXVaultInfo | null;
  hasVault: boolean;
}> {
  const params = new URLSearchParams({ collection });
  const response = await fetch(`/api/marketplace/nftx?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch NFTX listings");
  }

  return {
    listings: data.listings || [],
    vault: data.vault || null,
    hasVault: data.hasVault || false,
  };
}

/**
 * NFTX vault info returned from API
 */
interface NFTXVaultInfo {
  address: string;
  symbol: string;
  name: string;
}

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * Hook to fetch marketplace listings for a collection
 * Uses React Query for caching and automatic refetching
 */
export function useMarketplaceListings(
  collection: CollectionKey | null,
  options?: {
    limit?: number;
    autoFetch?: boolean;
    /** Initial items from SSR to avoid loading spinner */
    initialItems?: MarketplaceItem[];
    /** Initial collection info from SSR */
    initialCollectionInfo?: CollectionInfo;
  },
) {
  const {
    limit = 50,
    autoFetch = true,
    initialItems,
    initialCollectionInfo,
  } = options || {};

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["marketplace", "listings", collection, limit],
    queryFn: ({ pageParam }) =>
      fetchMarketplaceListings(collection!, limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next || undefined,
    enabled: autoFetch && !!collection,
    staleTime: 30_000, // Consider data fresh for 30 seconds
    initialData:
      initialItems && initialCollectionInfo
        ? {
            pages: [
              {
                listings: initialItems,
                collection: initialCollectionInfo,
                next: null,
              },
            ],
            pageParams: [undefined],
          }
        : undefined,
  });

  // Flatten all pages into a single array of items
  const items = useMemo(() => {
    if (!data?.pages) return [];
    const allItems: MarketplaceItem[] = [];
    const seenIds = new Set<string>();

    for (const page of data.pages) {
      for (const item of page.listings) {
        if (!seenIds.has(item.nft.identifier)) {
          seenIds.add(item.nft.identifier);
          allItems.push(item);
        }
      }
    }
    return allItems;
  }, [data?.pages]);

  // Get collection info from the first page
  const collectionInfo = data?.pages[0]?.collection || null;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["marketplace", "listings", collection],
    });
    refetch();
  }, [queryClient, collection, refetch]);

  return {
    items,
    isLoading: isLoading || isFetchingNextPage,
    error: error?.message || null,
    hasMore: !!hasNextPage,
    collectionInfo,
    loadMore,
    refresh,
  };
}

/**
 * Hook to fetch NFT details with offers
 * Uses React Query for caching
 */
export function useNFTDetails(
  collection: CollectionKey | null,
  tokenId: string | null,
) {
  const queryClient = useQueryClient();

  const { data: item, isLoading, error, refetch } = useQuery({
    queryKey: ["marketplace", "nft", collection, tokenId],
    queryFn: () => fetchNFTDetails(collection!, tokenId!),
    enabled: !!collection && !!tokenId,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["marketplace", "nft", collection, tokenId],
    });
    refetch();
  }, [queryClient, collection, tokenId, refetch]);

  return {
    item: item || null,
    isLoading,
    error: error?.message || null,
    refresh,
  };
}

/**
 * Hook for marketplace actions (buy, list, accept offer)
 */
export function useMarketplaceActions() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  /**
   * Buy an NFT (fulfill a listing)
   */
  const buyNFT = useCallback(
    async (
      collection: CollectionKey,
      tokenId: string,
      listing: Listing,
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !address || !walletClient) {
        return { success: false, error: "Wallet not connected" };
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Get fulfillment data from API
        const response = await fetch("/api/marketplace/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderHash: listing.orderHash,
            collection,
            tokenId,
            accountAddress: address,
            side: "listing",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get fulfillment data");
        }

        // The API returns { success, transaction: { to, data, value } }
        const transaction = data.transaction;

        if (!transaction?.to || !transaction?.data) {
          throw new Error("No transaction data in fulfillment response");
        }

        // Send the transaction
        const txHash = await walletClient.sendTransaction({
          to: transaction.to as `0x${string}`,
          data: transaction.data as `0x${string}`,
          value: BigInt(transaction.value || "0"),
        });

        setLastTxHash(txHash);
        return { success: true, txHash };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transaction failed";
        setError(message);
        console.error("Error buying NFT:", err);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, address, walletClient],
  );

  /**
   * Accept an offer on your NFT
   */
  const acceptOffer = useCallback(
    async (
      collection: CollectionKey,
      tokenId: string,
      offer: Offer,
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !address || !walletClient) {
        return { success: false, error: "Wallet not connected" };
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Get fulfillment data for the offer
        const response = await fetch("/api/marketplace/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderHash: offer.orderHash,
            collection,
            tokenId,
            accountAddress: address,
            side: "offer",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get fulfillment data");
        }

        // The API returns { success, transaction: { to, data, value } }
        const transaction = data.transaction;

        if (!transaction?.to || !transaction?.data) {
          throw new Error("No transaction data in fulfillment response");
        }

        // Send the transaction
        const txHash = await walletClient.sendTransaction({
          to: transaction.to as `0x${string}`,
          data: transaction.data as `0x${string}`,
          value: BigInt(transaction.value || "0"),
        });

        setLastTxHash(txHash);
        return { success: true, txHash };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transaction failed";
        setError(message);
        console.error("Error accepting offer:", err);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, address, walletClient],
  );

  /**
   * Create a listing for your NFT
   * Note: This requires approval of the NFT to OpenSea's contract first
   */
  const createListing = useCallback(
    async (
      _collection: CollectionKey,
      _tokenId: string,
      _priceInEth: string,
      _expirationDays: number = 30,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!isConnected || !address || !walletClient) {
        return { success: false, error: "Wallet not connected" };
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Creating listings requires the OpenSea SDK on the client
        // This is more complex as it needs wallet signing for Seaport orders
        // For now, we'll redirect to OpenSea for listing

        // In a full implementation, you would:
        // 1. Check if NFT is approved for OpenSea Seaport
        // 2. If not, prompt approval transaction
        // 3. Create a Seaport order and sign it
        // 4. Submit the signed order to OpenSea

        return {
          success: false,
          error:
            "Direct listing not yet implemented. Please use OpenSea to list your NFT.",
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Listing failed";
        setError(message);
        console.error("Error creating listing:", err);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, address, walletClient],
  );

  return {
    isConnected,
    address,
    isProcessing,
    error,
    lastTxHash,
    buyNFT,
    acceptOffer,
    createListing,
  };
}

/**
 * Hook to check if connected wallet owns a specific NFT
 */
export function useNFTOwnership(
  collection: CollectionKey | null,
  tokenId: string | null,
) {
  const { address, isConnected } = useAccount();
  const { item } = useNFTDetails(collection, tokenId);

  const isOwner = useMemo(() => {
    if (!isConnected || !address || !item?.nft.owner) {
      return false;
    }
    return item.nft.owner.toLowerCase() === address.toLowerCase();
  }, [isConnected, address, item]);

  return { isOwner, ownerAddress: item?.nft.owner };
}

/**
 * Hook to fetch NFTX pool listings for a collection
 * Uses React Query for caching and automatic refetching
 */
export function useNFTXListings(
  collection: CollectionKey | null,
  options?: {
    autoFetch?: boolean;
  },
) {
  const { autoFetch = true } = options || {};
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetched } = useQuery({
    queryKey: ["marketplace", "nftx", collection],
    queryFn: () => fetchNFTXListings(collection!),
    enabled: autoFetch && !!collection,
    staleTime: 30_000, // Consider data fresh for 30 seconds
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["marketplace", "nftx", collection],
    });
    refetch();
  }, [queryClient, collection, refetch]);

  return {
    items: data?.listings || [],
    isLoading,
    error: error?.message || null,
    vaultInfo: data?.vault || null,
    hasVault: data?.hasVault || false,
    hasFetched: isFetched,
    refresh,
  };
}

/**
 * Hook for buying from NFTX pool
 */
export function useNFTXBuy() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  /**
   * Get a quote for buying NFTs from NFTX pool
   */
  const getQuote = useCallback(
    async (
      collection: CollectionKey,
      tokenIds: string[],
    ): Promise<{
      totalPriceEth: string;
      pricePerNft: string;
      feePerNft: string;
      vaultAddress: string;
    } | null> => {
      try {
        const response = await fetch("/api/marketplace/nftx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collection, tokenIds, action: "quote" }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get quote");
        }

        return data.quote;
      } catch (err) {
        console.error("Error getting NFTX quote:", err);
        return null;
      }
    },
    [],
  );

  /**
   * Buy NFTs from NFTX pool using the MarketplaceZap contract
   */
  const buyFromPool = useCallback(
    async (
      collection: CollectionKey,
      tokenIds: string[],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _nftxListing: NFTXListing,
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !address || !walletClient) {
        return { success: false, error: "Wallet not connected" };
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Get transaction data from API
        const response = await fetch("/api/marketplace/nftx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection,
            tokenIds,
            action: "buy",
            buyerAddress: address,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get transaction data");
        }

        const { transaction } = data;

        if (!transaction?.to || !transaction?.data) {
          throw new Error("Invalid transaction data received");
        }

        // Send the transaction
        const txHash = await walletClient.sendTransaction({
          to: transaction.to as `0x${string}`,
          data: transaction.data as `0x${string}`,
          value: BigInt(transaction.value || "0"),
        });

        setLastTxHash(txHash);
        return { success: true, txHash };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transaction failed";
        setError(message);
        console.error("Error buying from NFTX:", err);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, address, walletClient],
  );

  return {
    isConnected,
    address,
    isProcessing,
    error,
    lastTxHash,
    getQuote,
    buyFromPool,
  };
}
