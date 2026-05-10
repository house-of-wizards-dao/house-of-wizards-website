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
  GetOffersResponse,
} from "opensea-js/lib/api/types";
// @ts-ignore - ethers is a dependency of opensea-js
import { JsonRpcProvider, VoidSigner } from "ethers";
import { unstable_cache } from "next/cache";
import { frwcAddresses } from "@/config/addresses";
import { logger } from "@/lib/logger";
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
export const getCollection = (key: CollectionKey): CollectionInfo => {
  return collections[key];
};

/**
 * Race a promise against a timeout. If the timeout fires first, rejects
 * with a `TimeoutError`. Used for SSR-time fetches where we want to bail
 * to a client-side fallback quickly rather than letting ethers'
 * `FetchRequest` default 5-minute timeout block the render.
 */
export class TimeoutError extends Error {
  constructor(label: string, ms: number) {
    super(`${label} timed out after ${ms}ms`);
    this.name = "TimeoutError";
  }
}

export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  label = "request",
): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new TimeoutError(label, ms)), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }) as Promise<T>;
};

/**
 * Get collection key from contract address
 */
export const getCollectionKeyByAddress = (
  address: string,
): CollectionKey | null => {
  const normalizedAddress = address.toLowerCase();
  for (const [key, info] of Object.entries(collections)) {
    if (info.address.toLowerCase() === normalizedAddress) {
      return key as CollectionKey;
    }
  }
  return null;
};

/**
 * Mainnet RPC URL used by server-side OpenSea SDK calls.
 *
 * Order of preference:
 *   1. `OPENSEA_RPC_URL` (server-only override)
 *   2. `NEXT_PUBLIC_ALCHEMY_API_KEY` (Alchemy mainnet endpoint)
 *   3. Fallback public RPC (rate-limited; only used if no key is set)
 */
const getMainnetRpcUrl = (): string => {
  if (process.env.OPENSEA_RPC_URL) return process.env.OPENSEA_RPC_URL;
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  if (alchemyKey) {
    return `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
  }
  return "https://eth.llamarpc.com";
};

/**
 * Initialize OpenSea SDK for mainnet.
 *
 * @param accountAddress - Optional buyer/seller address. When provided, the
 *   SDK is constructed with a {@link VoidSigner} bound to that address. This
 *   is required for any code path that ends up calling `seaport.fulfillOrders`
 *   (or other write paths) on the server: passing a raw {@link JsonRpcProvider}
 *   makes seaport-js fall back to `provider.getSigner(addr)`, which calls
 *   `eth_accounts` against the RPC. Public/Alchemy nodes either rate-limit
 *   that method or return `[]`, breaking transaction building. A
 *   {@link VoidSigner} short-circuits seaport-js's `_getSigner` so the SDK
 *   only uses the signer to populate calldata — it never actually signs or
 *   sends, which is exactly what we want for a server-side calldata builder.
 *
 * Read-only paths (listings, NFT metadata, etc.) can omit `accountAddress`.
 */
export const getOpenSeaSDK = (accountAddress?: string) => {
  const apiKey = process.env.OPENSEA_API_KEY;
  const provider = new JsonRpcProvider(getMainnetRpcUrl());
  const signerOrProvider = accountAddress
    ? new VoidSigner(accountAddress, provider)
    : provider;
  return new OpenSeaSDK(
    signerOrProvider,
    {
      apiKey: apiKey || undefined,
      chain: Chain.Mainnet,
    },
    (arg: string) => {
      if (process.env.NODE_ENV === "development") {
        logger.debug("OpenSea API", { message: arg });
      }
    },
  );
};

/**
 * Item offers for a single NFT. OpenSea no longer allows GET on
 * `/api/v2/orders/{chain}/seaport/offers` (405); opensea-js `getNFTOffers` still
 * calls that path, so we use the collection NFT offers route instead.
 */
const fetchOffersForCollectionNft = async (
  collectionSlug: string,
  tokenId: string,
  limit: number,
): Promise<GetOffersResponse> => {
  const capped = Math.min(Math.max(limit, 1), 100);
  const url = new URL(
    `https://api.opensea.io/api/v2/offers/collection/${encodeURIComponent(collectionSlug)}/nfts/${encodeURIComponent(String(tokenId))}`,
  );
  url.searchParams.set("limit", String(capped));

  const headers = new Headers({ Accept: "application/json" });
  const apiKey = process.env.OPENSEA_API_KEY;
  if (apiKey) headers.set("X-API-KEY", apiKey);

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `OpenSea NFT offers HTTP ${res.status}: ${body.slice(0, 240)}`,
    );
  }
  const data: unknown = await res.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !Array.isArray((data as { offers?: unknown }).offers)
  ) {
    throw new Error("OpenSea NFT offers: unexpected response shape");
  }
  return data as GetOffersResponse;
};

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
const toISOTimestamp = (
  value: string | number | bigint | undefined,
  fallbackToFuture: boolean = false,
): string => {
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
};

/**
 * Convert OpenSea order to our Listing type
 */
const orderToListing = (order: OpenSeaListing): Listing => {
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
};

/**
 * Convert OpenSea order to our Offer type
 * Handles both token-specific offers and collection offers which have different structures
 */
export const orderToOffer = (
  order: OpenSeaOffer | OpenSeaCollectionOffer,
): Offer => {
  const priceData = order.price;
  const params = order.protocol_data?.parameters;
  const offerItem = params?.offer?.[0];

  // Prefer the Seaport offer item because it is the exact ERC20 amount that
  // the bidder is offering. The API price object is display metadata.
  let amount = offerItem?.startAmount || priceData?.value || "0";
  let currency = priceData?.currency || "WETH";
  let decimals = priceData?.decimals || 18;

  if (
    offerItem?.token?.toLowerCase() ===
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  ) {
    currency = "WETH";
    decimals = 18;
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
    status: order.status,
    protocolData: order.protocol_data,
  };
};

const isActiveOffer = (offer: Offer, now = new Date()): boolean => {
  if (offer.status && offer.status.toLowerCase() !== "active") return false;
  const expiration = new Date(offer.expirationTime);
  if (Number.isNaN(expiration.getTime())) return false;
  return expiration > now;
};

const getOfferAmount = (offer: Offer): bigint => {
  try {
    return BigInt(offer.price.amount || "0");
  } catch {
    return 0n;
  }
};

/** Mainnet WETH — Seaport ERC20 bids use this token for ETH-denominated offers */
const WETH_MAINNET = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

/** Seaport item types — we only need ERC20 for bid/fees breakdown */
const SEAPORT_ITEM_TYPE_ERC20 = 1;

type SeaportOfferLike = {
  itemType?: number;
  token?: string;
  startAmount?: string;
  endAmount?: string;
  recipient?: string;
};

type SeaportParametersLike = {
  offer?: SeaportOfferLike[];
  consideration?: SeaportOfferLike[];
};

/**
 * Estimate WETH wei the seller receives when fulfilling an offer (bid) order:
 * gross WETH on the offer side minus WETH consideration paid to third parties
 * (platform, royalties). Matches wallet previews better than raw bid size.
 */
export const estimateSellerNetWeiFromBidOrder = (
  protocolData: unknown,
  sellerAddress: string,
): bigint | null => {
  const seller = sellerAddress.trim().toLowerCase();
  if (!seller) return null;

  const params = protocolData as SeaportParametersLike | undefined;
  const offerItems = params?.offer;
  if (!Array.isArray(offerItems) || offerItems.length === 0) return null;

  let grossWeth = 0n;
  for (const item of offerItems) {
    if (item.itemType !== SEAPORT_ITEM_TYPE_ERC20) continue;
    if ((item.token || "").toLowerCase() !== WETH_MAINNET) continue;
    try {
      grossWeth += BigInt(item.startAmount ?? item.endAmount ?? "0");
    } catch {
      return null;
    }
  }
  if (grossWeth === 0n) return null;

  let explicitToSeller = 0n;
  let wethFeesAndRoyalties = 0n;

  for (const item of params?.consideration ?? []) {
    if (item.itemType !== SEAPORT_ITEM_TYPE_ERC20) continue;
    if ((item.token || "").toLowerCase() !== WETH_MAINNET) continue;
    let amt: bigint;
    try {
      amt = BigInt(item.startAmount ?? item.endAmount ?? "0");
    } catch {
      continue;
    }
    const recip = (item.recipient || "").toLowerCase();
    if (recip === seller) explicitToSeller += amt;
    else wethFeesAndRoyalties += amt;
  }

  if (explicitToSeller > 0n) return explicitToSeller;

  const net = grossWeth - wethFeesAndRoyalties;
  return net >= 0n ? net : null;
};

/**
 * Replace {@link Offer.price} amount with seller net wei when derivable; keeps
 * gross total in {@link Offer.grossBidAmount}.
 */
export const offerWithSellerNetProceeds = (
  offer: Offer,
  sellerAddress: string,
): Offer => {
  const netWei = estimateSellerNetWeiFromBidOrder(
    offer.protocolData,
    sellerAddress,
  );
  if (netWei === null || netWei <= 0n) return offer;

  let grossWei: bigint;
  try {
    grossWei = BigInt(offer.price.amount || "0");
  } catch {
    grossWei = netWei;
  }

  const displayWei = netWei > grossWei ? grossWei : netWei;
  return {
    ...offer,
    grossBidAmount: offer.price.amount,
    price: {
      ...offer.price,
      amount: displayWei.toString(),
    },
  };
};

const getBestActiveOffer = (offers: Offer[]): Offer | undefined => {
  const now = new Date();
  let best: Offer | undefined;
  for (const offer of offers) {
    if (!isActiveOffer(offer, now)) continue;
    if (!best || getOfferAmount(offer) > getOfferAmount(best)) {
      best = offer;
    }
  }
  return best;
};

const isActiveOpenSeaOffer = (
  order: OpenSeaOffer | OpenSeaCollectionOffer,
): boolean => {
  if (order.status && order.status.toLowerCase() !== "active") return false;
  const endTime = order.protocol_data?.parameters?.endTime;
  const expiration =
    typeof endTime === "string" || typeof endTime === "number"
      ? Number(endTime) * 1000
      : 0;
  return Number.isFinite(expiration) && expiration > Date.now();
};

/** OpenSea offer models use a flat `price`; listings nest `price.current`. */
const isOpenSeaOfferPayload = (
  value: unknown,
): value is OpenSeaOffer | OpenSeaCollectionOffer =>
  typeof value === "object" &&
  value !== null &&
  "order_hash" in value &&
  typeof (value as { order_hash: unknown }).order_hash === "string" &&
  (value as { order_hash: string }).order_hash.length > 0 &&
  "price" in value &&
  typeof (value as { price: unknown }).price === "object" &&
  (value as { price: Record<string, unknown> }).price !== null &&
  !("current" in (value as { price: Record<string, unknown> }).price);

const openSeaNFTToMarketplaceNFT = (
  nftData: NonNullable<Awaited<ReturnType<typeof getCachedNFT>>>,
  collection: CollectionInfo,
  tokenId: string,
): MarketplaceNFT => ({
  identifier: nftData.identifier || tokenId,
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
  traits: parseTraits(nftData.traits || []),
});

/**
 * Convert OpenSea NFT traits to our format
 */
export const parseTraits = (
  traits: OpenSeaTrait[] | null | undefined,
): NFTTrait[] => {
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
};

/**
 * Fetch listings for a collection using collection slug
 * Deduplicates by token ID, keeping only the best (lowest price) listing per NFT
 */
export const fetchCollectionListings = async (
  collectionKey: CollectionKey,
  limit: number = 50,
  next?: string,
): Promise<{ listings: MarketplaceItem[]; next?: string }> => {
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
            owner: nftData?.owners?.[0]?.address,
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
    logger.error(`Error fetching listings for ${collectionKey}`, error);
    throw error;
  }
};

/**
 * Fetch all NFTs in a collection (with optional listing filter)
 */
export const fetchCollectionNFTs = async (
  collectionKey: CollectionKey,
  limit: number = 50,
  next?: string,
): Promise<{ nfts: MarketplaceNFT[]; next?: string }> => {
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
    logger.error(`Error fetching NFTs for ${collectionKey}`, error);
    throw error;
  }
};

/**
 * Fetch NFTs owned by a wallet for a collection, including active offers.
 * Used by sell mode so owners can either accept the highest current offer or
 * queue owned items for new OpenSea listings.
 */
export const fetchWalletSellItems = async (
  collectionKey: CollectionKey,
  ownerAddress: string,
  limit: number = 100,
): Promise<MarketplaceItem[]> => {
  const sdk = getOpenSeaSDK();
  const collection = getCollection(collectionKey);
  const ownedTokenIds: string[] = [];
  let next: string | null = null;
  let pageCount = 0;
  const maxPages = 10;

  try {
    do {
      const response = await sdk.api.getNFTsByAccount(
        ownerAddress,
        200,
        next || undefined,
        Chain.Mainnet,
      );
      for (const nft of response.nfts || []) {
        if (nft.contract?.toLowerCase() !== collection.address.toLowerCase()) {
          continue;
        }
        ownedTokenIds.push(nft.identifier);
        if (ownedTokenIds.length >= limit) break;
      }
      next = response.next || null;
      pageCount += 1;
    } while (next && pageCount < maxPages && ownedTokenIds.length < limit);

    const items: MarketplaceItem[] = [];
    const batchSize = 8;
    for (let i = 0; i < ownedTokenIds.length; i += batchSize) {
      const batch = ownedTokenIds.slice(i, i + batchSize);
      const batchItems = await Promise.all(
        batch.map(async (tokenId) => {
          const nftData = await getCachedNFT(collection.address, tokenId);
          if (!nftData) return null;

          let bestOffer: Offer | undefined;
          try {
            const bestRaw = await sdk.api.getBestOffer(
              collection.slug,
              tokenId,
            );
            if (
              isOpenSeaOfferPayload(bestRaw) &&
              isActiveOpenSeaOffer(bestRaw)
            ) {
              const converted: Offer = {
                ...orderToOffer(bestRaw),
                isCollectionOffer:
                  "criteria" in bestRaw && bestRaw.criteria != null,
              };
              if (isActiveOffer(converted)) {
                bestOffer = offerWithSellerNetProceeds(converted, ownerAddress);
              }
            }
          } catch (error) {
            logger.warn(
              `getBestOffer failed for ${collectionKey} #${tokenId}`,
              error,
            );
            try {
              const offersResponse = await fetchOffersForCollectionNft(
                collection.slug,
                tokenId,
                50,
              );
              const tokenOnly = (offersResponse.offers || [])
                .filter(isActiveOpenSeaOffer)
                .map(orderToOffer)
                .filter((offer) => isActiveOffer(offer));
              const fallbackBest = getBestActiveOffer(tokenOnly);
              if (fallbackBest) {
                bestOffer = offerWithSellerNetProceeds(
                  fallbackBest,
                  ownerAddress,
                );
              }
            } catch (fallbackErr) {
              logger.warn(
                `Fallback offers fetch failed for ${collectionKey} #${tokenId}`,
                fallbackErr,
              );
            }
          }

          const offers = bestOffer ? [bestOffer] : [];

          return {
            nft: {
              ...openSeaNFTToMarketplaceNFT(nftData, collection, tokenId),
              owner: ownerAddress,
            },
            collection,
            listings: [],
            offers,
            bestOffer,
            source: "opensea",
          } as MarketplaceItem;
        }),
      );
      for (const item of batchItems) {
        if (item) items.push(item);
      }
    }

    return items.sort((a, b) => {
      const offerA = a.bestOffer ? getOfferAmount(a.bestOffer) : 0n;
      const offerB = b.bestOffer ? getOfferAmount(b.bestOffer) : 0n;
      if (offerA !== offerB) return offerA > offerB ? -1 : 1;
      return parseInt(a.nft.identifier, 10) - parseInt(b.nft.identifier, 10);
    });
  } catch (error) {
    logger.error(`Error fetching sell items for ${collectionKey}`, error);
    throw error;
  }
};

/**
 * Get best listings for a collection (lowest prices)
 */
export const getBestListings = async (
  collectionKey: CollectionKey,
  limit: number = 50,
): Promise<MarketplaceItem[]> => {
  const result = await fetchCollectionListings(collectionKey, limit);

  // Sort by price ascending
  return result.listings.sort((a, b) => {
    const priceA = parseFloat(a.bestListing?.price.amount || "0");
    const priceB = parseFloat(b.bestListing?.price.amount || "0");
    return priceA - priceB;
  });
};
