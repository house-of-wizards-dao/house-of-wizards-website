"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";
import { cn } from "@/lib/utils";
import {
  useMarketplaceListings,
  useNFTDetails,
  useMarketplaceActions,
  useNFTXListings,
  useNFTXBuy,
} from "@/hooks/useMarketplace";
import type {
  CollectionKey,
  MarketplaceItem,
  CollectionInfo,
  MarketplaceSource,
} from "@/types/marketplace";
import {
  MarketplaceItemCard,
  MarketplaceItemSkeleton,
} from "./MarketplaceItemCard";
import { ItemDetailOverlay } from "./ItemDetailOverlay";

type MarketplaceBrowserProps = {
  initialCollection?: CollectionKey;
  /** Pre-fetched listings from server-side rendering */
  initialListings?: MarketplaceItem[];
  /** Pre-fetched collection info from server-side rendering */
  initialCollectionInfo?: CollectionInfo;
};

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
  const [marketplaceSource, setMarketplaceSource] =
    useState<MarketplaceSource>("opensea");

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

  // Fetch OpenSea listings for selected collection
  // Pass initial data from SSR to avoid loading spinner on first render
  const {
    items: openseaItems,
    isLoading: openseaLoading,
    error: openseaError,
    hasMore,
    collectionInfo,
    loadMore,
    refresh: refreshOpensea,
  } = useMarketplaceListings(selectedCollection, {
    limit: 50,
    autoFetch: marketplaceSource === "opensea",
    // Only use initial data for the initial collection
    initialItems:
      selectedCollection === initialCollection ? initialListings : undefined,
    initialCollectionInfo:
      selectedCollection === initialCollection
        ? initialCollectionInfo
        : undefined,
  });

  // Fetch NFTX pool listings
  // Always fetch to detect if vault exists (for showing the tab)
  const {
    items: nftxItems,
    isLoading: nftxLoading,
    error: nftxError,
    hasFetched: nftxHasFetched,
    refresh: refreshNftx,
  } = useNFTXListings(selectedCollection, {
    autoFetch: true, // Always fetch to detect vault
  });

  // Marketplace actions (buy, etc.)
  const { buyNFT, isConnected } = useMarketplaceActions();
  const { buyFromPool } = useNFTXBuy();

  // Combined items based on selected source
  const items = marketplaceSource === "nftx" ? nftxItems : openseaItems;
  const isLoading = marketplaceSource === "nftx" ? nftxLoading : openseaLoading;
  const error = marketplaceSource === "nftx" ? nftxError : openseaError;

  // Refresh function for current source
  const refresh = useCallback(() => {
    if (marketplaceSource === "nftx") {
      refreshNftx();
    } else {
      refreshOpensea();
    }
  }, [marketplaceSource, refreshNftx, refreshOpensea]);

  // Fetch detailed info when an item is selected
  const { item: detailedItem } = useNFTDetails(
    selectedItem?.collection.key || null,
    selectedItem?.nft.identifier || null,
  );

  // Helper to get item price in ETH
  const getItemPriceEth = useCallback(
    (item: MarketplaceItem): number | null => {
      if (item.nftxListing) {
        return parseFloat(item.nftxListing.priceEth);
      }
      if (item.bestListing) {
        return parseFloat(item.bestListing.price.amount) / 1e18;
      }
      return null;
    },
    [],
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

    // Filter by listing status (NFTX items are always "listed" in the pool)
    if (showOnlyListed && marketplaceSource === "opensea") {
      result = result.filter((item) => item.listings.length > 0);
    }

    // Filter by price range
    if (priceFilter !== "all") {
      result = result.filter((item) => {
        const priceEth = getItemPriceEth(item);
        if (priceEth === null) return false;
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
          const priceA = getItemPriceEth(a) ?? Infinity;
          const priceB = getItemPriceEth(b) ?? Infinity;
          return priceA - priceB;
        }
        case "price_desc": {
          const priceA = getItemPriceEth(a) ?? 0;
          const priceB = getItemPriceEth(b) ?? 0;
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
  }, [
    items,
    nameQuery,
    idQuery,
    showOnlyListed,
    priceFilter,
    sortBy,
    marketplaceSource,
    getItemPriceEth,
  ]);

  // Handle collection change
  const handleCollectionChange = useCallback((key: CollectionKey) => {
    setSelectedCollection(key);
    setNameQuery("");
    setIdQuery("");
    // Reset to OpenSea when switching collections
    setMarketplaceSource("opensea");
  }, []);

  // Handle marketplace source change
  const handleSourceChange = useCallback((source: MarketplaceSource) => {
    setMarketplaceSource(source);
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
        // Handle NFTX purchase
        if (item.nftxListing && marketplaceSource === "nftx") {
          const result = await buyFromPool(
            item.collection.key,
            [item.nft.identifier],
            item.nftxListing,
          );
          if (result.success) {
            refresh();
          }
          return;
        }

        // Handle OpenSea purchase
        if (!item.bestListing || !isConnected) return;

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
    [
      buyNFT,
      buyFromPool,
      isConnected,
      isOnMainnet,
      switchChain,
      refresh,
      marketplaceSource,
    ],
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

      {/* Marketplace Source Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm">Source:</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleSourceChange("opensea")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              marketplaceSource === "opensea"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700",
            )}
          >
            <svg viewBox="0 0 90 90" className="w-4 h-4" fill="currentColor">
              <path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.701 34.911 46.935C34.839 47.043 34.713 47.106 34.578 47.106H22.545C22.221 47.106 22.032 46.756 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.134 52.677 36.936 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.311 46.899 40.896 45.756 41.373 44.604C41.472 44.388 41.553 44.163 41.634 43.938C41.769 43.524 41.913 43.137 42.012 42.75C42.111 42.426 42.192 42.084 42.273 41.76C42.489 40.824 42.579 39.834 42.579 38.808C42.579 38.403 42.561 37.98 42.516 37.575C42.489 37.134 42.426 36.693 42.363 36.252C42.318 35.892 42.237 35.523 42.156 35.163C42.012 34.479 41.841 33.804 41.634 33.147L41.562 32.895C41.409 32.391 41.274 31.914 41.094 31.41C40.599 29.997 40.059 28.62 39.483 27.342C39.267 26.865 39.033 26.406 38.799 25.956C38.457 25.29 38.106 24.678 37.782 24.093C37.611 23.796 37.458 23.526 37.305 23.247C37.134 22.941 36.954 22.635 36.774 22.347C36.648 22.131 36.504 21.933 36.396 21.735L35.487 20.232C35.352 20.016 35.559 19.746 35.802 19.818L42.219 21.603H42.237C42.246 21.603 42.255 21.612 42.264 21.612L43.08 21.843L43.986 22.101L44.298 22.194V18.792C44.298 17.244 45.549 16 47.079 16C47.85 16 48.546 16.308 49.05 16.821C49.554 17.334 49.869 18.03 49.869 18.792V23.544L50.541 23.742C50.595 23.76 50.649 23.787 50.694 23.823C50.856 23.949 51.099 24.138 51.414 24.372C51.66 24.561 51.924 24.786 52.251 25.029C52.887 25.515 53.64 26.1 54.447 26.766C54.666 26.937 54.876 27.117 55.095 27.297C56.133 28.188 57.288 29.214 58.398 30.366C58.707 30.699 59.016 31.032 59.325 31.392C59.634 31.761 59.961 32.121 60.252 32.49C60.651 32.994 61.077 33.516 61.458 34.074C61.629 34.323 61.818 34.581 61.989 34.848C62.448 35.523 62.853 36.225 63.24 36.927C63.393 37.224 63.546 37.557 63.681 37.881C64.059 38.745 64.356 39.627 64.536 40.509C64.599 40.716 64.644 40.941 64.671 41.148V41.193C64.752 41.508 64.779 41.841 64.806 42.192C64.896 43.083 64.842 43.974 64.644 44.865C64.536 45.369 64.392 45.855 64.212 46.359C64.032 46.845 63.834 47.349 63.591 47.817C63.123 48.798 62.577 49.752 61.923 50.634C61.716 50.949 61.482 51.273 61.239 51.579C60.996 51.903 60.744 52.209 60.51 52.506C60.186 52.902 59.844 53.316 59.493 53.694C59.178 54.054 58.854 54.423 58.503 54.756C58.017 55.269 57.549 55.746 57.063 56.205C56.736 56.52 56.382 56.853 56.028 57.159C55.683 57.474 55.329 57.771 55.002 58.041C54.513 58.44 54.117 58.749 53.784 58.995L53.154 59.481C53.037 59.571 52.893 59.616 52.749 59.616H49.869V67.932H54.603C55.872 67.932 57.078 67.482 58.059 66.645C58.377 66.384 59.634 65.313 61.095 63.798C61.149 63.744 61.221 63.699 61.302 63.672L73.863 60.075C74.124 59.994 74.376 60.192 74.376 60.462V52.812Z" />
            </svg>
            OpenSea
          </button>
          <button
            onClick={() => handleSourceChange("nftx")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
              marketplaceSource === "nftx"
                ? "bg-pink-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700",
            )}
          >
            <span className="font-bold text-xs">NFTX</span>
            Pool
            {nftxLoading || !nftxHasFetched ? (
              <svg
                className="w-3 h-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <span className="text-xs opacity-75">({nftxItems.length})</span>
            )}
          </button>
        </div>
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

      {/* Load More (OpenSea only - NFTX loads all at once) */}
      {hasMore && !isLoading && marketplaceSource === "opensea" && (
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
