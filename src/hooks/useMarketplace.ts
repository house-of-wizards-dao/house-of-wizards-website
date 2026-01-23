"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useWalletClient } from "wagmi";
import type {
  CollectionKey,
  MarketplaceItem,
  CollectionInfo,
  Listing,
  Offer,
} from "@/types/marketplace";

/**
 * Hook to fetch marketplace listings for a collection
 */
export function useMarketplaceListings(
  collection: CollectionKey | null,
  options?: {
    limit?: number;
    autoFetch?: boolean;
  },
) {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo | null>(
    null,
  );

  const { limit = 50, autoFetch = true } = options || {};

  const fetchListings = useCallback(
    async (cursor?: string) => {
      if (!collection) return;

      setIsLoading(true);
      setError(null);

      try {
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

        setCollectionInfo(data.collection);

        if (cursor) {
          // Append to existing items, deduplicating by token ID
          setItems((prev) => {
            const existingIds = new Set(
              prev.map((item) => item.nft.identifier),
            );
            const newItems = (data.listings as MarketplaceItem[]).filter(
              (item) => !existingIds.has(item.nft.identifier),
            );
            return [...prev, ...newItems];
          });
        } else {
          // Replace items
          setItems(data.listings);
        }

        setNextCursor(data.next || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching listings:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [collection, limit],
  );

  const loadMore = useCallback(() => {
    if (nextCursor && !isLoading) {
      fetchListings(nextCursor);
    }
  }, [nextCursor, isLoading, fetchListings]);

  const refresh = useCallback(() => {
    setItems([]);
    setNextCursor(null);
    fetchListings();
  }, [fetchListings]);

  // Auto-fetch on mount and collection change
  useEffect(() => {
    if (autoFetch && collection) {
      setItems([]);
      setNextCursor(null);
      fetchListings();
    }
  }, [collection, autoFetch, fetchListings]);

  return {
    items,
    isLoading,
    error,
    hasMore: !!nextCursor,
    collectionInfo,
    loadMore,
    refresh,
  };
}

/**
 * Hook to fetch NFT details with offers
 */
export function useNFTDetails(
  collection: CollectionKey | null,
  tokenId: string | null,
) {
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!collection || !tokenId) {
      setItem(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        collection,
        tokenId,
      });

      const response = await fetch(`/api/marketplace/nft?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch NFT details");
      }

      setItem(data.item);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching NFT details:", err);
    } finally {
      setIsLoading(false);
    }
  }, [collection, tokenId]);

  // Fetch on mount and when collection/tokenId change
  useEffect(() => {
    if (collection && tokenId) {
      fetchDetails();
    }
  }, [collection, tokenId, fetchDetails]);

  return {
    item,
    isLoading,
    error,
    refresh: fetchDetails,
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
