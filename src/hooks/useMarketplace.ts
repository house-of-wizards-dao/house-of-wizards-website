"use client";

import { useState, useCallback, useMemo } from "react";
import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { OpenSeaSDK, Chain } from "@opensea/sdk/viem";
import type {
  CollectionKey,
  MarketplaceItem,
  CollectionInfo,
  Listing,
  Offer,
  NFTXListing,
} from "@/types/marketplace";
import { frwcAddresses } from "@/config/addresses";
import { logger } from "@/lib/logger";

// ============================================================================
// API Fetcher Functions
// ============================================================================

/**
 * Fetch OpenSea marketplace listings for a collection
 */
const fetchMarketplaceListings = async (
  collection: CollectionKey,
  limit: number,
  cursor?: string,
): Promise<{
  listings: MarketplaceItem[];
  collection: CollectionInfo;
  next: string | null;
}> => {
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
};

/**
 * Fetch connected-wallet items for sell mode, including active offers.
 */
const fetchSellItems = async (
  collection: CollectionKey,
  owner: string,
  limit: number,
): Promise<{
  items: MarketplaceItem[];
  collection: CollectionInfo;
  count: number;
}> => {
  const params = new URLSearchParams({
    collection,
    owner,
    limit: String(limit),
  });
  const response = await fetch(`/api/marketplace/sell-items?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch wallet items");
  }

  return data;
};

/**
 * Fetch NFTX pool listings for a collection
 */
const fetchNFTXListings = async (
  collection: CollectionKey,
): Promise<{
  listings: MarketplaceItem[];
  vault: NFTXVaultInfo | null;
  hasVault: boolean;
}> => {
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
};

/**
 * NFTX vault info returned from API
 */
type NFTXVaultInfo = {
  address: string;
  symbol: string;
  name: string;
};

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * Hook to fetch marketplace listings for a collection
 * Uses React Query for caching and automatic refetching
 */
export const useMarketplaceListings = (
  collection: CollectionKey | null,
  options?: {
    limit?: number;
    autoFetch?: boolean;
    /** Initial items from SSR to avoid loading spinner */
    initialItems?: MarketplaceItem[];
    /** Initial collection info from SSR */
    initialCollectionInfo?: CollectionInfo;
  },
) => {
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
};

/**
 * Hook to fetch wallet-owned collection items for sell mode.
 */
export const useMarketplaceSellItems = (
  collection: CollectionKey | null,
  owner: string | undefined,
  options?: {
    limit?: number;
    autoFetch?: boolean;
  },
) => {
  const { limit = 100, autoFetch = true } = options || {};
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["marketplace", "sell-items", collection, owner, limit],
    queryFn: () => fetchSellItems(collection!, owner!, limit),
    enabled: autoFetch && !!collection && !!owner,
    staleTime: 15_000,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["marketplace", "sell-items", collection, owner],
    });
    refetch();
  }, [queryClient, collection, owner, refetch]);

  return {
    items: data?.items || [],
    collectionInfo: data?.collection || null,
    isLoading: isLoading || isFetching,
    error: error?.message || null,
    refresh,
  };
};

type ListingInput = {
  collection: CollectionKey;
  tokenId: string;
  priceInEth: string;
};

/**
 * Hook for marketplace actions (buy, list, accept offer)
 */
export const useMarketplaceActions = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient({
    account: address ? (address as `0x${string}`) : undefined,
  });
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
        logger.error("Error buying NFT", err);
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
        logger.error("Error accepting offer", err);
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
  const createListings = useCallback(
    async (
      listings: ListingInput[],
      includeOptionalCreatorFees: boolean,
      expirationDays: number = 30,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!isConnected || !address || !walletClient || !publicClient) {
        return { success: false, error: "Wallet not connected" };
      }
      if (listings.length === 0) {
        return { success: false, error: "No listings to create" };
      }
      const invalidListing = listings.find((listing) => {
        const price = Number(listing.priceInEth);
        return !Number.isFinite(price) || price <= 0;
      });
      if (invalidListing) {
        return {
          success: false,
          error: `Enter a valid listing price for token #${invalidListing.tokenId}`,
        };
      }

      const openSeaApiKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY?.trim();
      if (!openSeaApiKey) {
        return {
          success: false,
          error:
            "OpenSea API key is not configured. Set NEXT_PUBLIC_OPENSEA_API_KEY (same value as OPENSEA_API_KEY is fine) and restart the dev server.",
        };
      }

      setIsProcessing(true);
      setError(null);

      try {
        const sdk = new OpenSeaSDK(
          { publicClient, walletClient },
          { chain: Chain.Mainnet, apiKey: openSeaApiKey },
        );
        const expirationTime =
          Math.floor(Date.now() / 1000) + expirationDays * 24 * 60 * 60;

        if (listings.length === 1) {
          const listing = listings[0];
          await sdk.createListing({
            accountAddress: address,
            asset: {
              tokenAddress: frwcAddresses[listing.collection],
              tokenId: listing.tokenId,
            },
            amount: listing.priceInEth,
            expirationTime,
            includeOptionalCreatorFees,
          });
        } else {
          await sdk.createBulkListings({
            accountAddress: address,
            listings: listings.map((listing) => ({
              asset: {
                tokenAddress: frwcAddresses[listing.collection],
                tokenId: listing.tokenId,
              },
              amount: listing.priceInEth,
              expirationTime,
              includeOptionalCreatorFees,
            })),
          });
        }

        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Listing failed";
        setError(message);
        logger.error("Error creating listing", err);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, address, walletClient, publicClient],
  );

  const createListing = useCallback(
    async (
      collection: CollectionKey,
      tokenId: string,
      priceInEth: string,
      expirationDays: number = 30,
    ): Promise<{ success: boolean; error?: string }> => {
      return createListings(
        [{ collection, tokenId, priceInEth }],
        false,
        expirationDays,
      );
    },
    [createListings],
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
    createListings,
  };
};

/**
 * Hook to check if connected wallet owns a specific NFT.
 * Pass the on-chain owner from the current marketplace item (e.g. OpenSea metadata).
 */
export const useNFTOwnership = (ownerAddress?: string | null) => {
  const { address, isConnected } = useAccount();

  const isOwner = useMemo(() => {
    if (!isConnected || !address || !ownerAddress) {
      return false;
    }
    return ownerAddress.toLowerCase() === address.toLowerCase();
  }, [isConnected, address, ownerAddress]);

  return { isOwner, ownerAddress: ownerAddress ?? undefined };
};

/**
 * Hook to fetch NFTX pool listings for a collection
 * Uses React Query for caching and automatic refetching
 */
export const useNFTXListings = (
  collection: CollectionKey | null,
  options?: {
    autoFetch?: boolean;
  },
) => {
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
};

/**
 * Hook for buying from NFTX pool
 */
export const useNFTXBuy = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  /**
   * Buy NFTs from NFTX pool using the MarketplaceZap contract
   */
  const buyFromPool = useCallback(
    async (
      collection: CollectionKey,
      tokenIds: string[],
      nftxListing: NFTXListing,
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
            priceWei: nftxListing.priceWei,
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
        logger.error("Error buying from NFTX", err);
        return { success: false, error: message };
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, address, walletClient],
  );

  /**
   * Buy a batch of NFTs from the NFTX pool atomically.
   * Caller must supply the authoritative batch `priceWei` (e.g. from
   * useNFTXBatchQuote) so that msg.value matches getAmountsIn for the batch.
   */
  const buyBatchFromPool = useCallback(
    async (
      collection: CollectionKey,
      tokenIds: string[],
      priceWei: string,
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !address || !walletClient) {
        return { success: false, error: "Wallet not connected" };
      }
      if (tokenIds.length === 0) {
        return { success: false, error: "No tokens to buy" };
      }

      setIsProcessing(true);
      setError(null);

      try {
        const response = await fetch("/api/marketplace/nftx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection,
            tokenIds,
            action: "buy",
            buyerAddress: address,
            priceWei,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to get NFTX batch transaction");
        }

        const { transaction } = data;
        if (!transaction?.to || !transaction?.data) {
          throw new Error("Invalid transaction data received");
        }

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
        logger.error("Error batch-buying from NFTX", err);
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
    buyFromPool,
    buyBatchFromPool,
  };
};

export type BatchOpenSeaOrder = {
  orderHash: string;
  tokenId: string;
};

/**
 * Hook for atomic batch fulfillment of multiple OpenSea listings via Seaport.
 *
 * The server fetches a fully signed `OrderWithCounter` for each cart item
 * via OpenSea's `generateFulfillmentData` (which always includes the
 * canonical signature), feeds them to seaport-js's `fulfillOrders`, and
 * returns a single `fulfillAvailableAdvancedOrders` calldata. The client
 * submits exactly one transaction — the user signs once.
 *
 * Per Seaport semantics, individual orders that are no longer fulfillable
 * (e.g. already sold) are skipped without reverting the whole tx, so the
 * buyer receives the orders that are still available.
 */
export const useBatchOpenSeaBuy = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const buyBatch = useCallback(
    async (
      collection: CollectionKey,
      orders: BatchOpenSeaOrder[],
    ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
      if (!isConnected || !address || !walletClient) {
        return { success: false, error: "Wallet not connected" };
      }
      if (orders.length === 0) {
        return { success: false, error: "No orders to fulfill" };
      }

      setIsProcessing(true);
      setError(null);

      try {
        const response = await fetch("/api/marketplace/fulfill-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection,
            orders,
            accountAddress: address,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to get batch fulfillment data");
        }

        const { transaction } = data;
        if (!transaction?.to || !transaction?.data) {
          throw new Error("Invalid transaction data received");
        }

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
        logger.error("Error batch-buying from OpenSea", err);
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
    buyBatch,
  };
};
