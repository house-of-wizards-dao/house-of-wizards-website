"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";
import { cn } from "@/lib/utils";
import {
  useMarketplaceListings,
  useNFTDetails,
  useMarketplaceActions,
} from "@/hooks/useMarketplace";
import type {
  CollectionKey,
  MarketplaceItem,
  CollectionInfo,
} from "@/types/marketplace";
import {
  MarketplaceItemCard,
  MarketplaceItemSkeleton,
} from "./MarketplaceItemCard";
import { ItemDetailOverlay } from "./ItemDetailOverlay";

interface MarketplaceBrowserProps {
  initialCollection?: CollectionKey;
  /** Pre-fetched listings from server-side rendering */
  initialListings?: MarketplaceItem[];
  /** Pre-fetched collection info from server-side rendering */
  initialCollectionInfo?: CollectionInfo;
}

/**
 * Collection tabs for switching between collections
 */
const collectionOptions: { key: CollectionKey; label: string }[] = [
  { key: "wizards", label: "Wizards" },
  { key: "warriors", label: "Warriors" },
  { key: "souls", label: "Souls" },
  { key: "beasts", label: "Beasts" },
  { key: "ponies", label: "Ponies" },
  { key: "spawn", label: "Beast Spawn" },
  { key: "veil", label: "Infinity Veil" },
  { key: "locks", label: "Seventh Realm" },
  { key: "athenaeum", label: "Athenaeum" },
  { key: "impBox", label: "Treat Boxes" },
];

export function MarketplaceBrowser({
  initialCollection = "wizards",
  initialListings,
  initialCollectionInfo,
}: MarketplaceBrowserProps) {
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionKey>(initialCollection);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );
  const [showOnlyListed, setShowOnlyListed] = useState(true);
  const [priceFilter, setPriceFilter] = useState<
    "all" | "low" | "mid" | "high"
  >("all");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "token_id">(
    "price_asc",
  );
  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");
  const [buyingTokenId, setBuyingTokenId] = useState<string | null>(null);

  // Chain management - marketplace only works on Ethereum mainnet
  const { chainId, isConnected: isWalletConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const isOnMainnet = chainId === mainnet.id;

  // Auto-switch to mainnet when wallet is connected but on wrong chain
  useEffect(() => {
    if (isWalletConnected && !isOnMainnet && switchChain) {
      switchChain({ chainId: mainnet.id });
    }
  }, [isWalletConnected, isOnMainnet, switchChain]);

  // Fetch listings for selected collection
  // Pass initial data from SSR to avoid loading spinner on first render
  const {
    items,
    isLoading,
    error,
    hasMore,
    collectionInfo,
    loadMore,
    refresh,
  } = useMarketplaceListings(selectedCollection, {
    limit: 50,
    // Only use initial data for the initial collection
    initialItems:
      selectedCollection === initialCollection ? initialListings : undefined,
    initialCollectionInfo:
      selectedCollection === initialCollection
        ? initialCollectionInfo
        : undefined,
  });

  // Marketplace actions (buy, etc.)
  const { buyNFT, isConnected } = useMarketplaceActions();

  // Fetch detailed info when an item is selected
  const { item: detailedItem } = useNFTDetails(
    selectedItem?.collection.key || null,
    selectedItem?.nft.identifier || null,
  );

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by name
    if (nameQuery.trim()) {
      const q = nameQuery.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.nft.name?.toLowerCase().includes(q) ||
          item.nft.identifier.includes(q),
      );
    }

    // Filter by ID
    if (idQuery.trim()) {
      result = result.filter((item) =>
        item.nft.identifier.includes(idQuery.trim()),
      );
    }

    // Filter by listing status
    if (showOnlyListed) {
      result = result.filter((item) => item.listings.length > 0);
    }

    // Filter by price range
    if (priceFilter !== "all") {
      result = result.filter((item) => {
        if (!item.bestListing) return false;
        const priceEth = parseFloat(item.bestListing.price.amount) / 1e18;
        switch (priceFilter) {
          case "low":
            return priceEth < 0.5;
          case "mid":
            return priceEth >= 0.5 && priceEth < 2;
          case "high":
            return priceEth >= 2;
          default:
            return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price_asc": {
          const priceA = a.bestListing
            ? parseFloat(a.bestListing.price.amount)
            : Infinity;
          const priceB = b.bestListing
            ? parseFloat(b.bestListing.price.amount)
            : Infinity;
          return priceA - priceB;
        }
        case "price_desc": {
          const priceA = a.bestListing
            ? parseFloat(a.bestListing.price.amount)
            : 0;
          const priceB = b.bestListing
            ? parseFloat(b.bestListing.price.amount)
            : 0;
          return priceB - priceA;
        }
        case "token_id":
          return (
            parseInt(a.nft.identifier, 10) - parseInt(b.nft.identifier, 10)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [items, nameQuery, idQuery, showOnlyListed, priceFilter, sortBy]);

  // Handle collection change
  const handleCollectionChange = useCallback((key: CollectionKey) => {
    setSelectedCollection(key);
    setNameQuery("");
    setIdQuery("");
  }, []);

  // Handle item click
  const handleItemClick = useCallback((item: MarketplaceItem) => {
    setSelectedItem(item);
  }, []);

  // Handle overlay close
  const handleCloseOverlay = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Handle action complete (refresh data)
  const handleActionComplete = useCallback(() => {
    refresh();
  }, [refresh]);

  // Handle buy from card
  const handleBuy = useCallback(
    async (item: MarketplaceItem) => {
      if (!item.bestListing || !isConnected) return;

      // Ensure we're on mainnet before proceeding
      if (!isOnMainnet) {
        if (switchChain) {
          try {
            await switchChain({ chainId: mainnet.id });
          } catch {
            // User rejected chain switch
            return;
          }
        } else {
          return;
        }
      }

      setBuyingTokenId(item.nft.identifier);
      try {
        const result = await buyNFT(
          item.collection.key,
          item.nft.identifier,
          item.bestListing,
        );
        if (result.success) {
          refresh();
        }
      } finally {
        setBuyingTokenId(null);
      }
    },
    [buyNFT, isConnected, isOnMainnet, switchChain, refresh],
  );

  return (
    <div className="space-y-6">
      {/* Collection Selector */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-800">
        {collectionOptions.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleCollectionChange(key)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              selectedCollection === key
                ? "bg-violet-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name Search */}
        <input
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          placeholder="Search by name"
          className="w-full rounded-md bg-[#111015] text-white placeholder-gray-400 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        {/* ID Search */}
        <input
          value={idQuery}
          onChange={(e) => setIdQuery(e.target.value)}
          placeholder="Filter by ID"
          inputMode="numeric"
          className="w-full rounded-md bg-[#111015] text-white placeholder-gray-400 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        {/* Price Filter */}
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value as typeof priceFilter)}
          className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
        >
          <option value="all">All Prices</option>
          <option value="low">&lt; 0.5 ETH</option>
          <option value="mid">0.5 - 2 ETH</option>
          <option value="high">&gt; 2 ETH</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="token_id">Token ID</option>
        </select>
      </div>

      {/* Toggle for listed only */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyListed}
            onChange={(e) => setShowOnlyListed(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-[#111015] text-violet-500 focus:ring-2 focus:ring-violet-500"
          />
          <span className="text-gray-300">Show only listed items</span>
        </label>

        <button
          onClick={refresh}
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          Refresh
        </button>
      </div>

      {/* Wrong chain warning */}
      {isWalletConnected && !isOnMainnet && (
        <div className="bg-amber-900/50 text-amber-300 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>Please switch to Ethereum Mainnet to buy NFTs.</span>
          <button
            onClick={() => switchChain?.({ chainId: mainnet.id })}
            className="px-4 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Switch Network
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-gray-400 text-sm">
        {isLoading ? (
          "Loading..."
        ) : (
          <>
            Showing {filteredItems.length} of {items.length} items
            {collectionInfo && (
              <span className="ml-2">in {collectionInfo.name}</span>
            )}
          </>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading && items.length === 0
          ? // Loading skeletons
            Array.from({ length: 12 }).map((_, i) => (
              <MarketplaceItemSkeleton key={i} />
            ))
          : filteredItems.map((item) => (
              <MarketplaceItemCard
                key={`${item.collection.key}-${item.nft.identifier}`}
                item={item}
                onClick={handleItemClick}
                onBuy={isConnected ? handleBuy : undefined}
                isBuyLoading={buyingTokenId === item.nft.identifier}
              />
            ))}
      </div>

      {/* Load More */}
      {hasMore && !isLoading && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading more indicator */}
      {isLoading && items.length > 0 && (
        <div className="flex justify-center pt-6">
          <div className="text-gray-400">Loading more...</div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No items found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or selecting a different collection
          </p>
        </div>
      )}

      {/* Item Detail Overlay */}
      {selectedItem && (
        <ItemDetailOverlay
          item={detailedItem || selectedItem}
          isOpen={!!selectedItem}
          onClose={handleCloseOverlay}
          onActionComplete={handleActionComplete}
        />
      )}
    </div>
  );
}
