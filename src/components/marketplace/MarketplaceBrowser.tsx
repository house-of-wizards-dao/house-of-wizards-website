"use client";

import { useState, useMemo, useCallback, useEffect, ChangeEvent } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";
import { cn } from "@/lib/utils";
import {
  useMarketplaceListings,
  useMarketplaceActions,
  useMarketplaceSellItems,
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
  wizardTraits,
  wizardTraitParts,
  type WizardTraitPart,
} from "@/data/wizardTraits";
import { wizardsWithTraits } from "@/data/wizardsWithTraits";
import {
  warriorTraits,
  warriorTraitParts,
  type WarriorTraitPart,
} from "@/data/warriorTraits";
import { warriorsWithTraits } from "@/data/warriorsWithTraits";
import { TraitFilters } from "@/components/browser/TraitFilters";
import { useCart } from "@/hooks/useCart";
import { useNFTXBatchQuote } from "@/hooks/useNFTXBatchQuote";
import type { CartItem } from "@/types/cart";
import { cartItemKey } from "@/types/cart";
import { collections } from "@/lib/marketplace";
import { CartSidebar } from "./CartSidebar";
import { ItemDetailOverlay } from "./ItemDetailOverlay";
import {
  MarketplaceItemCard,
  MarketplaceItemSkeleton,
  getMarketplaceItemBuyPresentation,
} from "./MarketplaceItemCard";

type MarketplaceBrowserProps = {
  initialCollection?: CollectionKey;
  /** Pre-fetched listings from server-side rendering */
  initialListings?: MarketplaceItem[];
  /** Pre-fetched collection info from server-side rendering */
  initialCollectionInfo?: CollectionInfo;
};

type MarketplaceCardSize = "default" | "compact";
type MarketplaceMode = "buy" | "sell";

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

const cardSizeOptions: { key: MarketplaceCardSize; label: string }[] = [
  { key: "default", label: "Large" },
  { key: "compact", label: "Small" },
];

const parseEthPrice = (price: string | undefined): number | null => {
  if (!price) return null;
  const value = parseFloat(price);
  return Number.isFinite(value) ? value : null;
};

const formatBaseUnits = (amount: string, decimals: number): string => {
  try {
    const value = BigInt(amount || "0");
    const divisor = 10n ** BigInt(decimals);
    const whole = value / divisor;
    const fraction = value % divisor;
    const fractionText = fraction.toString().padStart(decimals, "0");
    const trimmedFraction = fractionText.slice(0, 4).replace(/0+$/, "");
    return trimmedFraction
      ? `${whole.toString()}.${trimmedFraction}`
      : whole.toString();
  } catch {
    return "0";
  }
};

const getOfferDisplayAmount = (item: MarketplaceItem): string | undefined => {
  if (!item.bestOffer) return undefined;
  return formatBaseUnits(
    item.bestOffer.price.amount,
    item.bestOffer.price.decimals,
  );
};

const getOfferDisplayValue = (item: MarketplaceItem): number | null => {
  const amount = getOfferDisplayAmount(item);
  if (!amount) return null;
  return parseEthPrice(amount);
};

// Pre-compute trait lookups for wizards and warriors
const wizardsByIdx = new Map(wizardsWithTraits.map((w) => [w.idx, w]));
const warriorsByIdx = new Map(warriorsWithTraits.map((w) => [w.idx, w]));

// Build wizard trait options by part
const wizardTraitOptions = (() => {
  const byPart: Record<
    WizardTraitPart,
    Array<{ value: number; label: string }>
  > = {
    prop: [],
    rune: [],
    familiar: [],
    head: [],
    body: [],
  };

  for (const t of wizardTraits) {
    if (t.part && t.part in byPart) {
      byPart[t.part].push({ value: t.idx, label: t.displayName });
    }
  }

  // Sort each part's options alphabetically
  for (const part of wizardTraitParts) {
    byPart[part].sort((a, b) => a.label.localeCompare(b.label));
  }

  return byPart;
})();

// Build warrior trait options by part
const warriorTraitOptions = (() => {
  const byPart: Record<
    WarriorTraitPart,
    Array<{ value: number; label: string }>
  > = {
    background: [],
    weapon: [],
    rune: [],
    companion: [],
    head: [],
    body: [],
    shield: [],
  };

  for (const t of warriorTraits) {
    if (t.part in byPart) {
      byPart[t.part].push({ value: t.idx, label: t.displayName });
    }
  }

  // Sort each part's options alphabetically
  for (const part of warriorTraitParts) {
    byPart[part].sort((a, b) => a.label.localeCompare(b.label));
  }

  return byPart;
})();

export const MarketplaceBrowser = ({
  initialCollection = "wizards",
  initialListings,
  initialCollectionInfo,
}: MarketplaceBrowserProps) => {
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionKey>(initialCollection);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );
  const [priceFilter, setPriceFilter] = useState<
    "all" | "low" | "mid" | "high"
  >("all");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "token_id">(
    "price_asc",
  );
  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");
  const [buyingTokenId, setBuyingTokenId] = useState<string | null>(null);
  const [sellingTokenId, setSellingTokenId] = useState<string | null>(null);
  const [marketplaceSource, setMarketplaceSource] =
    useState<MarketplaceSource>("all");
  const [marketplaceMode, setMarketplaceMode] =
    useState<MarketplaceMode>("buy");
  const [cardSize, setCardSize] = useState<MarketplaceCardSize>("default");

  // Trait filters for wizards and warriors
  const [selectedWizardTraits, setSelectedWizardTraits] = useState<
    Partial<Record<WizardTraitPart, number>>
  >({});
  const [selectedWarriorTraits, setSelectedWarriorTraits] = useState<
    Partial<Record<WarriorTraitPart, number>>
  >({});

  // Chain management - marketplace only works on Ethereum mainnet
  const { address, chainId, isConnected: isWalletConnected } = useAccount();
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
    autoFetch:
      marketplaceMode === "buy" &&
      (marketplaceSource === "opensea" || marketplaceSource === "all"),
    // Only use initial data for the initial collection
    initialItems:
      selectedCollection === initialCollection ? initialListings : undefined,
    initialCollectionInfo:
      selectedCollection === initialCollection
        ? initialCollectionInfo
        : undefined,
  });

  const {
    items: sellItems,
    isLoading: sellItemsLoading,
    error: sellItemsError,
    collectionInfo: sellCollectionInfo,
    refresh: refreshSellItems,
  } = useMarketplaceSellItems(selectedCollection, address, {
    autoFetch: marketplaceMode === "sell" && isWalletConnected,
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
  const { buyNFT, acceptOffer, isConnected } = useMarketplaceActions();
  const { buyFromPool } = useNFTXBuy();

  // Shopping cart
  const cart = useCart();
  const inCartKeys = useMemo(
    () => new Set(cart.items.map((item) => cartItemKey(item))),
    [cart.items],
  );
  const { quote: nftxBatchQuote } = useNFTXBatchQuote(
    cart.collectionKey,
    cart.nftxCount,
    {
      enabled:
        marketplaceMode === "buy" &&
        cart.collectionKey === selectedCollection &&
        cart.nftxCount > 0,
    },
  );

  // Shared per-item NFTX cost = totalEth / count. All NFTX items in the cart
  // display this same value (both on the marketplace cards and in the cart
  // sidebar), since AMM batch buys are effectively a single atomic purchase
  // and individual "per-NFT" pricing is meaningless.
  const sharedNftxPerItemEth = useMemo(() => {
    if (!nftxBatchQuote || nftxBatchQuote.count <= 0) return undefined;
    const totalEth = parseFloat(nftxBatchQuote.totalEth);
    if (!Number.isFinite(totalEth) || totalEth <= 0) return undefined;
    return (totalEth / nftxBatchQuote.count).toString();
  }, [nftxBatchQuote]);

  // Pending collection switch confirmation (when cart is non-empty and the
  // user clicks a different collection tab)
  const [pendingCollection, setPendingCollection] =
    useState<CollectionKey | null>(null);

  // Combined items based on selected source
  const items = useMemo(() => {
    if (marketplaceMode === "sell") return sellItems;
    if (marketplaceSource === "opensea") return openseaItems;
    if (marketplaceSource === "nftx") return nftxItems;

    // "all" - merge both sources, avoiding duplicates
    // For duplicates (same token ID), prefer OpenSea item but add NFTX listing info
    const nftxByTokenId = new Map(
      nftxItems.map((item) => [item.nft.identifier, item]),
    );
    const merged: MarketplaceItem[] = [];
    const seenTokenIds = new Set<string>();

    // Add OpenSea items, enriching with NFTX data if available
    for (const osItem of openseaItems) {
      const tokenId = osItem.nft.identifier;
      seenTokenIds.add(tokenId);
      const nftxItem = nftxByTokenId.get(tokenId);
      if (nftxItem) {
        // Item exists in both - merge NFTX listing into OpenSea item
        merged.push({
          ...osItem,
          nftxListing: nftxItem.nftxListing,
        });
      } else {
        merged.push(osItem);
      }
    }

    // Add NFTX-only items
    for (const nftxItem of nftxItems) {
      if (!seenTokenIds.has(nftxItem.nft.identifier)) {
        merged.push(nftxItem);
      }
    }

    return merged;
  }, [marketplaceMode, marketplaceSource, openseaItems, nftxItems, sellItems]);

  const isLoading =
    marketplaceMode === "sell"
      ? sellItemsLoading
      : marketplaceSource === "all"
        ? openseaLoading || nftxLoading
        : marketplaceSource === "nftx"
          ? nftxLoading
          : openseaLoading;
  const error =
    marketplaceMode === "sell"
      ? sellItemsError
      : marketplaceSource === "all"
        ? openseaError || nftxError
        : marketplaceSource === "nftx"
          ? nftxError
          : openseaError;
  const activeCollectionInfo =
    marketplaceMode === "sell" ? sellCollectionInfo : collectionInfo;

  // Refresh function for current source
  const refresh = useCallback(() => {
    if (marketplaceMode === "sell") {
      refreshSellItems();
      return;
    }
    if (marketplaceSource === "all") {
      refreshOpensea();
      refreshNftx();
    } else if (marketplaceSource === "nftx") {
      refreshNftx();
    } else {
      refreshOpensea();
    }
  }, [
    marketplaceMode,
    marketplaceSource,
    refreshNftx,
    refreshOpensea,
    refreshSellItems,
  ]);

  // Helper to get the currently displayed item price in ETH.
  const getDisplayedItemPriceEth = useCallback(
    (item: MarketplaceItem): number | null => {
      if (marketplaceMode === "sell") {
        return getOfferDisplayValue(item);
      }

      if (item.bestListing) {
        return parseEthPrice(
          (parseFloat(item.bestListing.price.amount) / 1e18).toString(),
        );
      }

      if (item.nftxListing) {
        const isInNftxCart = inCartKeys.has(
          cartItemKey({ source: "nftx", tokenId: item.nft.identifier }),
        );

        if (isInNftxCart && sharedNftxPerItemEth) {
          return parseEthPrice(sharedNftxPerItemEth);
        }

        if (
          !isInNftxCart &&
          cart.collectionKey === item.collection.key &&
          cart.nftxCount > 0 &&
          nftxBatchQuote
        ) {
          return parseEthPrice(nftxBatchQuote.marginalNextEth);
        }

        return parseEthPrice(item.nftxListing.priceEth);
      }
      return null;
    },
    [
      cart.collectionKey,
      cart.nftxCount,
      inCartKeys,
      nftxBatchQuote,
      sharedNftxPerItemEth,
      marketplaceMode,
    ],
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

    // Filter by price range
    if (priceFilter !== "all") {
      result = result.filter((item) => {
        const priceEth = getDisplayedItemPriceEth(item);
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

    // Filter by traits for wizards
    if (selectedCollection === "wizards") {
      const hasTraitFilter = Object.keys(selectedWizardTraits).length > 0;
      if (hasTraitFilter) {
        result = result.filter((item) => {
          const tokenId = parseInt(item.nft.identifier, 10);
          const wizard = wizardsByIdx.get(tokenId);
          if (!wizard) return false;

          for (const part of wizardTraitParts) {
            const selectedValue = selectedWizardTraits[part];
            if (typeof selectedValue === "number") {
              if (wizard[part] !== selectedValue) return false;
            }
          }
          return true;
        });
      }
    }

    // Filter by traits for warriors
    if (selectedCollection === "warriors") {
      const hasTraitFilter = Object.keys(selectedWarriorTraits).length > 0;
      if (hasTraitFilter) {
        result = result.filter((item) => {
          const tokenId = parseInt(item.nft.identifier, 10);
          const warrior = warriorsByIdx.get(tokenId);
          if (!warrior) return false;

          for (const part of warriorTraitParts) {
            const selectedValue = selectedWarriorTraits[part];
            if (typeof selectedValue === "number") {
              if (warrior[part] !== selectedValue) return false;
            }
          }
          return true;
        });
      }
    }

    // Sort
    result.sort((a, b) => {
      if (marketplaceMode === "sell") {
        const priceA = getDisplayedItemPriceEth(a) ?? 0;
        const priceB = getDisplayedItemPriceEth(b) ?? 0;
        if (priceA !== priceB) return priceB - priceA;
        return parseInt(a.nft.identifier, 10) - parseInt(b.nft.identifier, 10);
      }

      switch (sortBy) {
        case "price_asc": {
          const priceA = getDisplayedItemPriceEth(a) ?? Infinity;
          const priceB = getDisplayedItemPriceEth(b) ?? Infinity;
          return priceA - priceB;
        }
        case "price_desc": {
          const priceA = getDisplayedItemPriceEth(a) ?? 0;
          const priceB = getDisplayedItemPriceEth(b) ?? 0;
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
    priceFilter,
    sortBy,
    getDisplayedItemPriceEth,
    selectedCollection,
    selectedWizardTraits,
    selectedWarriorTraits,
    marketplaceMode,
  ]);

  // Apply a collection change (without cart confirmation)
  const applyCollectionChange = useCallback(
    (key: CollectionKey) => {
      setSelectedCollection(key);
      setNameQuery("");
      setIdQuery("");
      setSelectedWizardTraits({});
      setSelectedWarriorTraits({});
      if (marketplaceSource === "nftx") {
        setMarketplaceSource("all");
      }
    },
    [marketplaceSource],
  );

  // Handle collection change with cart guard. If the cart is locked to a
  // different collection, defer the switch until the user confirms.
  const handleCollectionChange = useCallback(
    (key: CollectionKey) => {
      if (key === selectedCollection) return;
      if (cart.count > 0 && cart.collectionKey && cart.collectionKey !== key) {
        setPendingCollection(key);
        return;
      }
      applyCollectionChange(key);
    },
    [applyCollectionChange, cart.collectionKey, cart.count, selectedCollection],
  );

  const confirmCollectionSwitch = useCallback(() => {
    if (!pendingCollection) return;
    cart.clear();
    applyCollectionChange(pendingCollection);
    setPendingCollection(null);
  }, [applyCollectionChange, cart, pendingCollection]);

  const cancelCollectionSwitch = useCallback(() => {
    setPendingCollection(null);
  }, []);

  // Handle marketplace source change
  const handleSourceChange = useCallback((source: MarketplaceSource) => {
    setMarketplaceSource(source);
  }, []);

  const handleModeChange = useCallback(
    (mode: MarketplaceMode) => {
      if (mode === marketplaceMode) return;
      if (cart.count > 0) {
        const ok = window.confirm(
          "Switching between buy and sell mode will clear the current cart. Continue?",
        );
        if (!ok) return;
        cart.clear();
      }
      setSelectedItem(null);
      setMarketplaceMode(mode);
    },
    [cart, marketplaceMode],
  );

  // Handle wizard trait selection
  const onSelectWizardTrait =
    (part: WizardTraitPart) => (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedWizardTraits((prev) => {
        const next = { ...prev };
        if (!value) {
          delete next[part];
        } else {
          next[part] = Number(value);
        }
        return next;
      });
    };

  // Handle warrior trait selection
  const onSelectWarriorTrait =
    (part: WarriorTraitPart) => (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedWarriorTraits((prev) => {
        const next = { ...prev };
        if (!value) {
          delete next[part];
        } else {
          next[part] = Number(value);
        }
        return next;
      });
    };

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
        // Determine which source to buy from
        const hasNftx = !!item.nftxListing;
        const hasOpensea = !!item.bestListing;

        // Calculate prices for comparison
        const nftxPriceEth = hasNftx
          ? parseFloat(item.nftxListing!.priceEth)
          : Infinity;
        const openseaPriceEth = hasOpensea
          ? parseFloat(item.bestListing!.price.amount) / 1e18
          : Infinity;

        // Decide which source to use:
        // - If source is explicitly "nftx", use NFTX
        // - If source is explicitly "opensea", use OpenSea
        // - If source is "all", pick the cheaper option
        const shouldUseNftx =
          marketplaceSource === "nftx" ||
          (marketplaceSource === "all" &&
            hasNftx &&
            (!hasOpensea || nftxPriceEth <= openseaPriceEth));

        if (shouldUseNftx && hasNftx) {
          // Handle NFTX purchase
          const result = await buyFromPool(
            item.collection.key,
            [item.nft.identifier],
            item.nftxListing!,
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

  const handleSellIntoOffer = useCallback(
    async (item: MarketplaceItem) => {
      if (!item.bestOffer || !isConnected) return;
      if (!isOnMainnet) {
        if (switchChain) {
          try {
            await switchChain({ chainId: mainnet.id });
          } catch {
            return;
          }
        } else {
          return;
        }
      }

      setSellingTokenId(item.nft.identifier);
      try {
        const result = await acceptOffer(
          item.collection.key,
          item.nft.identifier,
          item.bestOffer,
        );
        if (result.success) {
          refreshSellItems();
        }
      } finally {
        setSellingTokenId(null);
      }
    },
    [acceptOffer, isConnected, isOnMainnet, refreshSellItems, switchChain],
  );

  // Resolve the cart entry (snapshot/orderHash) for a marketplace item.
  // Prefers NFTX when both sources exist, mirroring batch UX.
  const buildCartItem = useCallback(
    (item: MarketplaceItem): CartItem | null => {
      const collectionKey = item.collection.key;
      if (marketplaceMode === "sell") {
        return {
          source: "sell",
          collectionKey,
          tokenId: item.nft.identifier,
          name:
            item.nft.name || `${item.collection.name} #${item.nft.identifier}`,
          imageUrl: item.nft.image_url,
          listingPriceEth: "",
        };
      }
      if (item.nftxListing) {
        const eth = item.nftxListing.priceEth;
        return {
          source: "nftx",
          collectionKey,
          tokenId: item.nft.identifier,
          name:
            item.nft.name || `${item.collection.name} #${item.nft.identifier}`,
          imageUrl: item.nft.image_url,
          snapshotPriceWei: item.nftxListing.priceWei,
          snapshotPriceEth: eth,
          vaultAddress: item.nftxListing.vaultAddress,
        };
      }
      if (item.bestListing) {
        const eth = (
          parseFloat(item.bestListing.price.amount) / 1e18
        ).toString();
        return {
          source: "opensea",
          collectionKey,
          tokenId: item.nft.identifier,
          name:
            item.nft.name || `${item.collection.name} #${item.nft.identifier}`,
          imageUrl: item.nft.image_url,
          snapshotPriceWei: item.bestListing.price.amount,
          snapshotPriceEth: eth,
          orderHash: item.bestListing.orderHash,
        };
      }
      return null;
    },
    [marketplaceMode],
  );

  const handleAddToCart = useCallback(
    (item: MarketplaceItem) => {
      const cartItem = buildCartItem(item);
      if (!cartItem) return;
      const result = cart.add(cartItem);
      if (!result.ok && result.reason === "collection-mismatch") {
        const ok = window.confirm(
          "Your cart is from a different collection. Clear it and start a new cart with this item?",
        );
        if (ok) {
          cart.add(cartItem, { replaceCollection: true });
          cart.setOpen(true);
        }
      } else if (!result.ok && result.reason === "mode-mismatch") {
        const ok = window.confirm(
          "Your cart is in a different mode. Clear it and start a new cart with this item?",
        );
        if (ok) {
          cart.add(cartItem, { replaceCollection: true });
          cart.setOpen(true);
        }
      } else {
        cart.setOpen(true);
      }
    },
    [buildCartItem, cart],
  );

  const handleRemoveFromCart = useCallback(
    (item: MarketplaceItem) => {
      // We don't know which source from the card alone, so remove both
      // possible matches if present. Cart only supports a single source per
      // tokenId in practice, so this is safe.
      cart.remove({ source: "nftx", tokenId: item.nft.identifier });
      cart.remove({ source: "opensea", tokenId: item.nft.identifier });
      cart.remove({ source: "sell", tokenId: item.nft.identifier });
    },
    [cart],
  );

  /** Grid card–matched price + source for the detail overlay buy CTA. */
  const selectedItemBuyPresentation = useMemo(() => {
    if (!selectedItem || marketplaceMode !== "buy") return null;
    const cartCandidate = buildCartItem(selectedItem);
    const isInCart =
      !!cartCandidate && inCartKeys.has(cartItemKey(cartCandidate));
    const showMarginal =
      !!selectedItem.nftxListing &&
      cart.collectionKey === selectedItem.collection.key &&
      cart.nftxCount > 0 &&
      !!nftxBatchQuote;

    return getMarketplaceItemBuyPresentation(selectedItem, {
      inCart: isInCart,
      marginalNftxPriceEth:
        showMarginal && nftxBatchQuote
          ? nftxBatchQuote.marginalNextEth
          : undefined,
      nftxBatchPerItemPriceEth:
        isInCart && !!selectedItem.nftxListing
          ? sharedNftxPerItemEth
          : undefined,
    });
  }, [
    selectedItem,
    marketplaceMode,
    buildCartItem,
    inCartKeys,
    cart.collectionKey,
    cart.nftxCount,
    nftxBatchQuote,
    sharedNftxPerItemEth,
  ]);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="min-w-0 flex-1 space-y-6">
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
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-400 text-sm">Source:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleSourceChange("all")}
                disabled={marketplaceMode === "sell"}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  marketplaceSource === "all"
                    ? "bg-violet-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                  marketplaceMode === "sell" && "opacity-50 cursor-not-allowed",
                )}
              >
                All
              </button>
              <button
                onClick={() => handleSourceChange("opensea")}
                disabled={marketplaceMode === "sell"}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  marketplaceSource === "opensea"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                  marketplaceMode === "sell" && "opacity-50 cursor-not-allowed",
                )}
              >
                <svg
                  viewBox="0 0 90 90"
                  className="w-4 h-4"
                  fill="currentColor"
                >
                  <path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.701 34.911 46.935C34.839 47.043 34.713 47.106 34.578 47.106H22.545C22.221 47.106 22.032 46.756 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.134 52.677 36.936 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.311 46.899 40.896 45.756 41.373 44.604C41.472 44.388 41.553 44.163 41.634 43.938C41.769 43.524 41.913 43.137 42.012 42.75C42.111 42.426 42.192 42.084 42.273 41.76C42.489 40.824 42.579 39.834 42.579 38.808C42.579 38.403 42.561 37.98 42.516 37.575C42.489 37.134 42.426 36.693 42.363 36.252C42.318 35.892 42.237 35.523 42.156 35.163C42.012 34.479 41.841 33.804 41.634 33.147L41.562 32.895C41.409 32.391 41.274 31.914 41.094 31.41C40.599 29.997 40.059 28.62 39.483 27.342C39.267 26.865 39.033 26.406 38.799 25.956C38.457 25.29 38.106 24.678 37.782 24.093C37.611 23.796 37.458 23.526 37.305 23.247C37.134 22.941 36.954 22.635 36.774 22.347C36.648 22.131 36.504 21.933 36.396 21.735L35.487 20.232C35.352 20.016 35.559 19.746 35.802 19.818L42.219 21.603H42.237C42.246 21.603 42.255 21.612 42.264 21.612L43.08 21.843L43.986 22.101L44.298 22.194V18.792C44.298 17.244 45.549 16 47.079 16C47.85 16 48.546 16.308 49.05 16.821C49.554 17.334 49.869 18.03 49.869 18.792V23.544L50.541 23.742C50.595 23.76 50.649 23.787 50.694 23.823C50.856 23.949 51.099 24.138 51.414 24.372C51.66 24.561 51.924 24.786 52.251 25.029C52.887 25.515 53.64 26.1 54.447 26.766C54.666 26.937 54.876 27.117 55.095 27.297C56.133 28.188 57.288 29.214 58.398 30.366C58.707 30.699 59.016 31.032 59.325 31.392C59.634 31.761 59.961 32.121 60.252 32.49C60.651 32.994 61.077 33.516 61.458 34.074C61.629 34.323 61.818 34.581 61.989 34.848C62.448 35.523 62.853 36.225 63.24 36.927C63.393 37.224 63.546 37.557 63.681 37.881C64.059 38.745 64.356 39.627 64.536 40.509C64.599 40.716 64.644 40.941 64.671 41.148V41.193C64.752 41.508 64.779 41.841 64.806 42.192C64.896 43.083 64.842 43.974 64.644 44.865C64.536 45.369 64.392 45.855 64.212 46.359C64.032 46.845 63.834 47.349 63.591 47.817C63.123 48.798 62.577 49.752 61.923 50.634C61.716 50.949 61.482 51.273 61.239 51.579C60.996 51.903 60.744 52.209 60.51 52.506C60.186 52.902 59.844 53.316 59.493 53.694C59.178 54.054 58.854 54.423 58.503 54.756C58.017 55.269 57.549 55.746 57.063 56.205C56.736 56.52 56.382 56.853 56.028 57.159C55.683 57.474 55.329 57.771 55.002 58.041C54.513 58.44 54.117 58.749 53.784 58.995L53.154 59.481C53.037 59.571 52.893 59.616 52.749 59.616H49.869V67.932H54.603C55.872 67.932 57.078 67.482 58.059 66.645C58.377 66.384 59.634 65.313 61.095 63.798C61.149 63.744 61.221 63.699 61.302 63.672L73.863 60.075C74.124 59.994 74.376 60.192 74.376 60.462V52.812Z" />
                </svg>
                OpenSea
              </button>
              <button
                onClick={() => handleSourceChange("nftx")}
                disabled={marketplaceMode === "sell"}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  marketplaceSource === "nftx"
                    ? "bg-pink-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                  marketplaceMode === "sell" && "opacity-50 cursor-not-allowed",
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
                  <span className="text-xs opacity-75">
                    ({nftxItems.length})
                  </span>
                )}
              </button>
            </div>
            <span className="text-gray-400 text-sm">Mode:</span>
            <div className="flex rounded-lg bg-gray-900 p-1">
              <button
                type="button"
                onClick={() => handleModeChange("buy")}
                aria-pressed={marketplaceMode === "buy"}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all border",
                  marketplaceMode === "buy"
                    ? "bg-violet-600 border-violet-300 text-white shadow-sm shadow-violet-600/40 ring-1 ring-violet-300/60"
                    : "border-transparent text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("sell")}
                aria-pressed={marketplaceMode === "sell"}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all border",
                  marketplaceMode === "sell"
                    ? "bg-emerald-600 border-emerald-300 text-white shadow-sm shadow-emerald-600/40 ring-1 ring-emerald-300/60"
                    : "border-transparent text-gray-300 hover:bg-gray-800 hover:text-white",
                )}
              >
                Sell
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
              onChange={(e) =>
                setPriceFilter(e.target.value as typeof priceFilter)
              }
              className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
            >
              <option value="all">
                {marketplaceMode === "sell" ? "All Offers" : "All Prices"}
              </option>
              <option value="low">&lt; 0.5 ETH</option>
              <option value="mid">0.5 - 2 ETH</option>
              <option value="high">&gt; 2 ETH</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              disabled={marketplaceMode === "sell"}
              className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
            >
              <option value="price_asc">
                {marketplaceMode === "sell"
                  ? "Highest Offer First"
                  : "Price: Low to High"}
              </option>
              <option value="price_desc">Price: High to Low</option>
              <option value="token_id">Token ID</option>
            </select>
          </div>

          {/* Trait Filters for Wizards */}
          {selectedCollection === "wizards" && (
            <div className="border-t border-gray-800 pt-4">
              <div className="text-sm text-gray-400 mb-3">Filter by Traits</div>
              <TraitFilters
                traits={wizardTraitParts}
                selectedTraits={selectedWizardTraits}
                partToTraitOptions={wizardTraitOptions}
                onSelectTrait={onSelectWizardTrait}
              />
            </div>
          )}

          {/* Trait Filters for Warriors */}
          {selectedCollection === "warriors" && (
            <div className="border-t border-gray-800 pt-4">
              <div className="text-sm text-gray-400 mb-3">Filter by Traits</div>
              <TraitFilters
                traits={warriorTraitParts}
                selectedTraits={selectedWarriorTraits}
                partToTraitOptions={warriorTraitOptions}
                onSelectTrait={onSelectWarriorTrait}
              />
            </div>
          )}

          {/* Marketplace actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={refresh}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Refresh
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Card size:</span>
              <div className="flex rounded-lg bg-gray-900 p-1">
                {cardSizeOptions.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCardSize(key)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      cardSize === key
                        ? "bg-violet-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wrong chain warning */}
          {isWalletConnected && !isOnMainnet && (
            <div className="bg-amber-900/50 text-amber-300 px-4 py-3 rounded-lg flex items-center justify-between">
              <span>
                Please switch to Ethereum Mainnet to{" "}
                {marketplaceMode === "sell" ? "sell or list NFTs" : "buy NFTs"}.
              </span>
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
                {activeCollectionInfo && (
                  <span className="ml-2">in {activeCollectionInfo.name}</span>
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
          <div
            className={cn(
              "grid gap-4",
              cardSize === "compact"
                ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6",
            )}
          >
            {isLoading && items.length === 0
              ? // Loading skeletons
                Array.from({ length: 12 }).map((_, i) => (
                  <MarketplaceItemSkeleton key={i} />
                ))
              : filteredItems.map((item) => {
                  const cartCandidate = buildCartItem(item);
                  const isInCart =
                    !!cartCandidate &&
                    inCartKeys.has(cartItemKey(cartCandidate));
                  const showMarginal =
                    !!item.nftxListing &&
                    cart.collectionKey === item.collection.key &&
                    cart.nftxCount > 0 &&
                    !!nftxBatchQuote;
                  return (
                    <MarketplaceItemCard
                      key={`${item.collection.key}-${item.nft.identifier}`}
                      item={item}
                      onClick={
                        marketplaceMode === "sell" ? undefined : handleItemClick
                      }
                      onBuy={
                        isConnected
                          ? marketplaceMode === "sell"
                            ? item.bestOffer
                              ? handleSellIntoOffer
                              : undefined
                            : handleBuy
                          : undefined
                      }
                      isBuyLoading={
                        marketplaceMode === "sell"
                          ? sellingTokenId === item.nft.identifier
                          : buyingTokenId === item.nft.identifier
                      }
                      size={cardSize}
                      inCart={isInCart}
                      onAddToCart={cartCandidate ? handleAddToCart : undefined}
                      onRemoveFromCart={
                        cartCandidate ? handleRemoveFromCart : undefined
                      }
                      marginalNftxPriceEth={
                        showMarginal && nftxBatchQuote
                          ? nftxBatchQuote.marginalNextEth
                          : undefined
                      }
                      nftxBatchPerItemPriceEth={
                        isInCart && !!item.nftxListing
                          ? sharedNftxPerItemEth
                          : undefined
                      }
                      priceEthOverride={
                        marketplaceMode === "sell" && item.bestOffer
                          ? getOfferDisplayAmount(item)
                          : undefined
                      }
                      priceCurrencyOverride={
                        marketplaceMode === "sell" && item.bestOffer
                          ? item.bestOffer.price.currency
                          : undefined
                      }
                      priceLabelOverride={
                        marketplaceMode === "sell" && item.bestOffer
                          ? "Offer"
                          : undefined
                      }
                      hoverActionLabel={
                        marketplaceMode === "sell" && item.bestOffer
                          ? "Accept"
                          : undefined
                      }
                      actionLoadingLabel={
                        marketplaceMode === "sell" ? "Selling..." : undefined
                      }
                    />
                  );
                })}
          </div>

          {/* Load More (OpenSea only - NFTX loads all at once) */}
          {hasMore &&
            !isLoading &&
            marketplaceMode === "buy" &&
            (marketplaceSource === "opensea" ||
              marketplaceSource === "all") && (
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
              <p className="text-gray-400 text-lg">
                {marketplaceMode === "sell" && !isWalletConnected
                  ? "Connect a wallet to view items you can sell"
                  : "No items found"}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {marketplaceMode === "sell"
                  ? "Owned items appear here ordered by their highest active offer."
                  : "Try adjusting your filters or selecting a different collection"}
              </p>
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <CartSidebar />
      </div>

      {/* Item Detail Overlay */}
      {selectedItem && (
        <ItemDetailOverlay
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={handleCloseOverlay}
          onActionComplete={handleActionComplete}
          marketplaceBuy={
            marketplaceMode === "buy" &&
            isConnected &&
            selectedItemBuyPresentation?.listingPrice &&
            selectedItemBuyPresentation.priceSource
              ? {
                  onBuy: () => handleBuy(selectedItem),
                  priceEth: selectedItemBuyPresentation.listingPrice,
                  priceSource: selectedItemBuyPresentation.priceSource,
                  isLoading: buyingTokenId === selectedItem.nft.identifier,
                }
              : undefined
          }
        />
      )}

      {/* Collection switch confirmation */}
      {pendingCollection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal
        >
          <div className="bg-[#0C0B10] border border-gray-800 rounded-lg p-5 max-w-sm w-full space-y-4">
            <h3 className="text-white font-bold text-lg">Switch collection?</h3>
            <p className="text-sm text-gray-300">
              Your cart contains items from{" "}
              <span className="text-violet-400">
                {cart.collectionKey
                  ? collections[cart.collectionKey].name
                  : "another collection"}
              </span>
              . Switching to{" "}
              <span className="text-violet-400">
                {collections[pendingCollection].name}
              </span>{" "}
              will clear your current cart.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cancelCollectionSwitch}
                className="px-4 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCollectionSwitch}
                className="px-4 py-2 rounded-md text-sm bg-red-600 hover:bg-red-500 text-white font-semibold"
              >
                Clear cart and switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
