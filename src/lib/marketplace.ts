/**
 * Marketplace utilities for OpenSea integration
 * Handles listings, offers, and order fulfillment
 */

/**
 * Marketplace feature configuration
 */
export const marketplaceConfig = {
  /** Enable/disable offers functionality (fetching and UI) */
  offersEnabled: false,
} as const;

import { OpenSeaSDK, Chain } from "opensea-js";
import type {
  Listing as OpenSeaListing,
  Offer as OpenSeaOffer,
  CollectionOffer as OpenSeaCollectionOffer,
  Trait as OpenSeaTrait,
} from "opensea-js/lib/api/types";
// @ts-ignore - ethers is a dependency of opensea-js
import { JsonRpcProvider } from "ethers";
import { unstable_cache } from "next/cache";
import { frwcAddresses } from "@/config/addresses";
import type {
  CollectionKey,
  CollectionInfo,
  MarketplaceNFT,
  Listing,
  Offer,
  NFTTrait,
  MarketplaceItem,
} from "@/types/marketplace";

/**
 * Collection configuration with OpenSea slugs
 * Slugs verified from https://opensea.io/category/forgottenrunes
 */
export const collections: Record<CollectionKey, CollectionInfo> = {
  wizards: {
    key: "wizards",
    name: "Forgotten Runes Wizards Cult",
    address: frwcAddresses.wizards,
    slug: "forgottenruneswizardscult",
    hasLocalMetadata: true,
  },
  warriors: {
    key: "warriors",
    name: "Forgotten Runes Warriors Guild",
    address: frwcAddresses.warriors,
    slug: "forgottenruneswarriorsguild",
    hasLocalMetadata: true,
  },
  souls: {
    key: "souls",
    name: "Forgotten Souls",
    address: frwcAddresses.souls,
    slug: "forgottensouls",
    hasLocalMetadata: false,
  },
  beasts: {
    key: "beasts",
    name: "Forgotten Runes Beasts",
    address: frwcAddresses.beasts,
    slug: "forgottenrunesbeasts",
    hasLocalMetadata: false,
  },
  ponies: {
    key: "ponies",
    name: "Forgotten Runes Ponies",
    address: frwcAddresses.ponies,
    slug: "forgottenrunesponies",
    hasLocalMetadata: false,
  },
  spawn: {
    key: "spawn",
    name: "Forgotten Runes Beast Spawn",
    address: frwcAddresses.spawn,
    slug: "forgottenrunesbeastspawn",
    hasLocalMetadata: false,
  },
  veil: {
    key: "veil",
    name: "The Forgotten Runes Infinity Veil",
    address: frwcAddresses.veil,
    slug: "infinityveil",
    hasLocalMetadata: false,
  },
  locks: {
    key: "locks",
    name: "Forgotten Runes Gate To The Seventh Realm",
    address: frwcAddresses.locks,
    slug: "forgottenrunesgatetotheseventhrealm",
    hasLocalMetadata: false,
  },
  athenaeum: {
    key: "athenaeum",
    name: "Forgotten Runes Athenaeum",
    address: frwcAddresses.athenaeum,
    slug: "athenaeum",
    hasLocalMetadata: false,
  },
  impBox: {
    key: "impBox",
    name: "Nightmare Imp's Treat Boxes",
    address: frwcAddresses.impBox,
    slug: "nightmareimpstreatboxes",
    hasLocalMetadata: false,
  },
};

/**
 * Get collection info by key
 */
export function getCollection(key: CollectionKey): CollectionInfo {
  return collections[key];
}

/**
 * Get collection key from contract address
 */
export function getCollectionKeyByAddress(
  address: string,
): CollectionKey | null {
  const normalizedAddress = address.toLowerCase();
  for (const [key, info] of Object.entries(collections)) {
    if (info.address.toLowerCase() === normalizedAddress) {
      return key as CollectionKey;
    }
  }
  return null;
}

/**
 * Initialize OpenSea SDK for mainnet
 */
export function getOpenSeaSDK() {
  const apiKey = process.env.OPENSEA_API_KEY;
  const provider = new JsonRpcProvider("https://eth.llamarpc.com");
  return new OpenSeaSDK(
    provider,
    {
      apiKey: apiKey || undefined,
      chain: Chain.Mainnet,
    },
    (arg: string) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("OpenSea API", { message: arg });
      }
    },
  );
}

/**
 * Cached NFT metadata fetcher
 * NFT metadata (name, image, traits) rarely changes, so we cache for 1 hour
 * This dramatically reduces API calls when fetching collection listings
 */
export const getCachedNFT = unstable_cache(
  async (contractAddress: string, tokenId: string) => {
    const sdk = getOpenSeaSDK();
    const response = await sdk.api.getNFT(
      contractAddress,
      tokenId,
      Chain.Mainnet,
    );
    return response.nft;
  },
  ["nft-metadata"],
  {
    revalidate: 3600, // 1 hour - metadata rarely changes
    tags: ["nft-metadata"],
  },
);

/**
 * Convert Unix timestamp (seconds) or ISO string to ISO string
 */
function toISOTimestamp(
  value: string | number | bigint | undefined,
  fallbackToFuture: boolean = false,
): string {
  // Fallback: use far future date if fallbackToFuture is true, otherwise current time
  const fallback = fallbackToFuture
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
    : new Date().toISOString();

  if (value === undefined || value === null || value === "") return fallback;

  // If it's a number or bigint, treat as Unix timestamp (seconds)
  if (typeof value === "number" || typeof value === "bigint") {
    const numValue = Number(value);
    // Unix timestamps are in seconds, but JS Date uses milliseconds
    // Check if it's already in milliseconds (> year 2100 in seconds would be ~4.1 billion)
    const ms = numValue > 4102444800 ? numValue : numValue * 1000;
    return new Date(ms).toISOString();
  }

  // If it's a string, check if it's a pure numeric string (Unix timestamp)
  // or if it looks like an ISO date string
  const strValue = String(value);

  // Check if it's purely numeric (Unix timestamp as string)
  if (/^\d+$/.test(strValue)) {
    const numValue = parseInt(strValue, 10);
    const ms = numValue > 4102444800 ? numValue : numValue * 1000;
    return new Date(ms).toISOString();
  }

  // Otherwise assume it's already an ISO string or other parseable date format
  // Validate it parses correctly
  const parsed = new Date(strValue);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  // Fallback if unparseable
  return fallback;
}

/**
 * Convert OpenSea order to our Listing type
 */
function orderToListing(order: OpenSeaListing): Listing {
  const priceData = order.price.current;
  const params = order.protocol_data?.parameters;

  return {
    orderHash: order.order_hash,
    chain: order.chain || "ethereum",
    protocol: "seaport",
    price: {
      amount: priceData.value || "0",
      currency: priceData.currency || "ETH",
      decimals: priceData.decimals || 18,
    },
    startTime: toISOTimestamp(params?.startTime),
    expirationTime: toISOTimestamp(params?.endTime, true),
    maker: params?.offerer || "",
    taker: params?.consideration?.[0]?.recipient,
    protocolData: order.protocol_data,
  };
}

/**
 * Convert OpenSea order to our Offer type
 * Handles both token-specific offers and collection offers which have different structures
 */
function orderToOffer(order: OpenSeaOffer | OpenSeaCollectionOffer): Offer {
  const priceData = order.price;
  const params = order.protocol_data?.parameters;

  // For offers, price.value contains the WETH amount
  // If not available, try to get it from protocol_data offer array
  let amount = priceData?.value || "0";
  let currency = priceData?.currency || "WETH";
  let decimals = priceData?.decimals || 18;

  // Fallback: try to get amount from protocol_data (collection offers)
  if (amount === "0" && params?.offer?.[0]) {
    const offerItem = params.offer[0];
    amount = offerItem.startAmount || "0";
    // WETH token address
    if (
      offerItem.token?.toLowerCase() ===
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    ) {
      currency = "WETH";
    }
  }

  return {
    orderHash: order.order_hash,
    chain: order.chain || "ethereum",
    protocol: "seaport",
    price: {
      amount,
      currency,
      decimals,
    },
    startTime: toISOTimestamp(params?.startTime),
    expirationTime: toISOTimestamp(params?.endTime, true),
    maker: params?.offerer || "",
    protocolData: order.protocol_data,
  };
}

/**
 * Convert OpenSea NFT traits to our format
 */
export function parseTraits(
  traits: OpenSeaTrait[] | null | undefined,
): NFTTrait[] {
  if (!Array.isArray(traits)) return [];
  return traits.map((t) => ({
    trait_type: t.trait_type,
    value: t.value instanceof Date ? t.value.toISOString() : t.value,
    // Cast display_type: OpenSea enum values match our string literals
    display_type:
      t.display_type === "None"
        ? null
        : (t.display_type as NFTTrait["display_type"]),
  }));
}

/**
 * Fetch listings for a collection using collection slug
 * Deduplicates by token ID, keeping only the best (lowest price) listing per NFT
 */
export async function fetchCollectionListings(
  collectionKey: CollectionKey,
  limit: number = 50,
  next?: string,
): Promise<{ listings: MarketplaceItem[]; next?: string }> {
  const sdk = getOpenSeaSDK();
  const collection = getCollection(collectionKey);

  try {
    // Fetch listings using collection slug via getAllListings
    const response = await sdk.api.getAllListings(
      collection.slug,
      limit,
      next || undefined,
    );

    const listings = response.listings || [];

    // Use a Map to deduplicate by token ID, keeping the best listing
    const itemsByTokenId = new Map<
      string,
      { listing: OpenSeaListing; tokenId: string }
    >();

    // First pass: collect unique tokens and their best listings
    for (const listing of listings) {
      // Extract token info from protocol data (SDK uses snake_case)
      const protocolData = listing.protocol_data;
      const offerItem = protocolData?.parameters?.offer?.[0];

      // Get token ID from the offer item
      const tokenId = offerItem?.identifierOrCriteria;

      if (!tokenId) continue;

      const tokenIdStr = String(tokenId);

      // Keep the listing with the lowest price for each token
      const existing = itemsByTokenId.get(tokenIdStr);
      if (existing) {
        const existingPrice = parseFloat(
          existing.listing.price?.current?.value || "0",
        );
        const newPrice = parseFloat(listing.price?.current?.value || "0");
        if (newPrice < existingPrice) {
          itemsByTokenId.set(tokenIdStr, { listing, tokenId: tokenIdStr });
        }
      } else {
        itemsByTokenId.set(tokenIdStr, { listing, tokenId: tokenIdStr });
      }
    }

    // Second pass: fetch NFT metadata for each unique token
    const items: MarketplaceItem[] = [];
    const tokenEntries = Array.from(itemsByTokenId.values());

    // Batch fetch NFT details (limit concurrent requests)
    const batchSize = 10;
    for (let i = 0; i < tokenEntries.length; i += batchSize) {
      const batch = tokenEntries.slice(i, i + batchSize);

      const nftPromises = batch.map(async ({ listing, tokenId }) => {
        try {
          // Fetch NFT details using cached fetcher (metadata rarely changes)
          const nftData = await getCachedNFT(collection.address, tokenId);

          const convertedListing = orderToListing(listing);

          const nft: MarketplaceNFT = {
            identifier: tokenId,
            collection: collection.slug,
            contract: collection.address,
            token_standard: nftData?.token_standard || "erc721",
            name: nftData?.name || `${collection.name} #${tokenId}`,
            description: nftData?.description || "",
            image_url: nftData?.image_url || "",
            metadata_url: nftData?.metadata_url || "",
            opensea_url:
              nftData?.opensea_url ||
              `https://opensea.io/assets/ethereum/${collection.address}/${tokenId}`,
            updated_at: nftData?.updated_at || new Date().toISOString(),
            is_disabled: nftData?.is_disabled || false,
            is_nsfw: nftData?.is_nsfw || false,
            traits: parseTraits(nftData?.traits || []),
          };

          return {
            nft,
            collection,
            listings: [convertedListing],
            offers: [],
            bestListing: convertedListing,
          } as MarketplaceItem;
        } catch (err) {
          // If we can't fetch NFT details, create a minimal entry
          const convertedListing = orderToListing(listing);
          return {
            nft: {
              identifier: tokenId,
              collection: collection.slug,
              contract: collection.address,
              token_standard: "erc721",
              name: `${collection.name} #${tokenId}`,
              description: "",
              image_url: "",
              metadata_url: "",
              opensea_url: `https://opensea.io/assets/ethereum/${collection.address}/${tokenId}`,
              updated_at: new Date().toISOString(),
              is_disabled: false,
              is_nsfw: false,
            },
            collection,
            listings: [convertedListing],
            offers: [],
            bestListing: convertedListing,
          } as MarketplaceItem;
        }
      });

      const batchResults = await Promise.all(nftPromises);
      items.push(...batchResults);
    }

    return {
      listings: items,
      next: response.next || undefined,
    };
  } catch (error) {
    console.error(`Error fetching listings for ${collectionKey}:`, error);
    throw error;
  }
}

/**
 * Fetch all NFTs in a collection (with optional listing filter)
 */
export async function fetchCollectionNFTs(
  collectionKey: CollectionKey,
  limit: number = 50,
  next?: string,
): Promise<{ nfts: MarketplaceNFT[]; next?: string }> {
  const sdk = getOpenSeaSDK();
  const collection = getCollection(collectionKey);

  try {
    const response = await sdk.api.getNFTsByCollection(
      collection.slug,
      limit,
      next || undefined,
    );

    const nfts: MarketplaceNFT[] = (response.nfts || []).map((nft) => ({
      identifier: nft.identifier,
      collection: collection.slug,
      contract: nft.contract || collection.address,
      token_standard: nft.token_standard || "erc721",
      name: nft.name || `${collection.name} #${nft.identifier}`,
      description: nft.description || "",
      image_url: nft.image_url || "",
      metadata_url: nft.metadata_url || "",
      opensea_url:
        nft.opensea_url ||
        `https://opensea.io/assets/ethereum/${collection.address}/${nft.identifier}`,
      updated_at: nft.updated_at || new Date().toISOString(),
      is_disabled: nft.is_disabled || false,
      is_nsfw: nft.is_nsfw || false,
      traits: parseTraits(nft.traits || []),
    }));

    return {
      nfts,
      next: response.next || undefined,
    };
  } catch (error) {
    console.error(`Error fetching NFTs for ${collectionKey}:`, error);
    throw error;
  }
}

/**
 * Fetch single NFT details with listings and offers
 * Includes both token-specific offers and collection-wide offers
 */
export async function fetchNFTDetails(
  collectionKey: CollectionKey,
  tokenId: string,
): Promise<MarketplaceItem | null> {
  const sdk = getOpenSeaSDK();
  const collection = getCollection(collectionKey);

  try {
    // Fetch NFT metadata using cached fetcher (metadata rarely changes)
    const nftData = await getCachedNFT(collection.address, tokenId);

    if (!nftData) return null;

    const nft: MarketplaceNFT = {
      identifier: nftData.identifier,
      collection: collection.slug,
      contract: nftData.contract || collection.address,
      token_standard: nftData.token_standard || "erc721",
      name: nftData.name || `${collection.name} #${tokenId}`,
      description: nftData.description || "",
      image_url: nftData.image_url || "",
      metadata_url: nftData.metadata_url || "",
      opensea_url:
        nftData.opensea_url ||
        `https://opensea.io/assets/ethereum/${collection.address}/${tokenId}`,
      updated_at: nftData.updated_at || new Date().toISOString(),
      is_disabled: nftData.is_disabled || false,
      is_nsfw: nftData.is_nsfw || false,
      traits: parseTraits(nftData.traits),
      owner: nftData.owners?.[0]?.address,
    };

    // Fetch listings for this NFT using getNFTListings
    const listingsResponse = await sdk.api.getNFTListings(
      collection.address,
      tokenId,
      50, // limit
      undefined, // next
      Chain.Mainnet,
    );

    const listings = (listingsResponse.listings || []).map(orderToListing);

    // Fetch offers only if enabled in config
    let offers: Offer[] = [];
    let bestOffer: Offer | undefined;

    if (marketplaceConfig.offersEnabled) {
      // Fetch token-specific offers and collection-wide offers in parallel
      const [tokenOffersResponse, collectionOffersResponse] = await Promise.all(
        [
          // Token-specific offers (offers for this exact NFT)
          sdk.api.getNFTOffers(
            collection.address,
            tokenId,
            50, // limit
            undefined, // next
            Chain.Mainnet,
          ),
          // Collection-wide offers (floor bids that apply to any NFT in the collection)
          sdk.api.getCollectionOffers(
            collection.slug,
            50, // limit
            undefined, // next
          ),
        ],
      );

      // Convert token-specific offers
      const tokenOffers = (tokenOffersResponse.offers || []).map(orderToOffer);

      // Convert collection offers and mark them as collection offers
      const collectionOffers = (collectionOffersResponse.offers || []).map(
        (order) => ({
          ...orderToOffer(order),
          isCollectionOffer: true,
        }),
      );

      // Merge offers, deduplicating by orderHash and filtering out expired offers
      const now = new Date();
      const offersByHash = new Map<string, Offer>();

      for (const offer of tokenOffers) {
        // Skip expired offers
        if (new Date(offer.expirationTime) <= now) continue;
        offersByHash.set(offer.orderHash, offer);
      }
      for (const offer of collectionOffers) {
        // Skip expired offers
        if (new Date(offer.expirationTime) <= now) continue;
        // Only add collection offers if not already present as token offer
        if (!offersByHash.has(offer.orderHash)) {
          offersByHash.set(offer.orderHash, offer);
        }
      }
      offers = Array.from(offersByHash.values());

      // Sort offers by price descending
      const sortedOffers = [...offers].sort(
        (a, b) => parseFloat(b.price.amount) - parseFloat(a.price.amount),
      );
      bestOffer = sortedOffers[0];
    }

    // Sort listings by price ascending
    const sortedListings = [...listings].sort(
      (a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount),
    );

    return {
      nft,
      collection,
      listings: sortedListings,
      offers,
      bestListing: sortedListings[0],
      bestOffer,
    };
  } catch (error) {
    console.error(
      `Error fetching NFT details for ${collectionKey} #${tokenId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Get best listings for a collection (lowest prices)
 */
export async function getBestListings(
  collectionKey: CollectionKey,
  limit: number = 50,
): Promise<MarketplaceItem[]> {
  const result = await fetchCollectionListings(collectionKey, limit);

  // Sort by price ascending
  return result.listings.sort((a, b) => {
    const priceA = parseFloat(a.bestListing?.price.amount || "0");
    const priceB = parseFloat(b.bestListing?.price.amount || "0");
    return priceA - priceB;
  });
}
