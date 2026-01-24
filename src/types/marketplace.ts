/**
 * Marketplace types for OpenSea integration
 */

import type { OpenSeaNFT } from "@/lib/opensea-nfts";

/**
 * Collection keys matching frwcAddresses
 */
export type CollectionKey =
  | "beasts"
  | "wizards"
  | "souls"
  | "warriors"
  | "ponies"
  | "spawn"
  | "veil"
  | "locks"
  | "athenaeum"
  | "impBox";

/**
 * Collection metadata for UI display
 */
export interface CollectionInfo {
  key: CollectionKey;
  name: string;
  address: string;
  slug: string; // OpenSea collection slug
  hasLocalMetadata: boolean; // wizards/warriors have local trait data
}

/**
 * NFT trait/attribute from OpenSea
 */
export interface NFTTrait {
  trait_type: string;
  value: string | number;
  display_type?: "number" | "boost_percentage" | "boost_number" | "date" | null;
}

/**
 * Extended NFT data with marketplace info
 */
export interface MarketplaceNFT extends OpenSeaNFT {
  traits?: NFTTrait[];
  owner?: string;
  rarity_rank?: number;
}

/**
 * Price with currency info
 */
export interface Price {
  amount: string; // Amount in base units (wei for ETH)
  currency: string; // e.g., "ETH", "WETH"
  decimals: number;
  usdValue?: number;
}

/**
 * Listing from OpenSea
 */
export interface Listing {
  orderHash: string;
  chain: string;
  protocol: string; // "seaport"
  price: Price;
  startTime: string; // ISO timestamp
  expirationTime: string; // ISO timestamp
  maker: string; // Seller address
  taker?: string; // Specific buyer if private sale
  protocolData?: unknown; // Full Seaport order data for fulfillment
}

/**
 * Offer/Bid from OpenSea
 */
export interface Offer {
  orderHash: string;
  chain: string;
  protocol: string;
  price: Price;
  startTime: string;
  expirationTime: string;
  maker: string; // Bidder address
  protocolData?: unknown;
  isCollectionOffer?: boolean; // True if this is a collection-wide offer (floor bid)
}

/**
 * NFT with full marketplace data (listings + offers)
 */
export interface MarketplaceItem {
  nft: MarketplaceNFT;
  collection: CollectionInfo;
  listings: Listing[];
  offers: Offer[];
  bestListing?: Listing; // Lowest price listing
  bestOffer?: Offer; // Highest offer
}

/**
 * Paginated listings response
 */
export interface ListingsResponse {
  items: MarketplaceItem[];
  next?: string;
  total?: number;
}

/**
 * Single NFT detail response
 */
export interface NFTDetailResponse {
  item: MarketplaceItem;
  ownerAddress?: string;
}

/**
 * Action types for marketplace transactions
 */
export type MarketplaceActionType =
  | "buy"
  | "list"
  | "cancel_listing"
  | "accept_offer"
  | "make_offer";

/**
 * Parameters for buying an NFT
 */
export interface BuyParams {
  orderHash: string;
  fulfillmentData: unknown; // Seaport fulfillment data
}

/**
 * Parameters for listing an NFT
 */
export interface ListParams {
  contractAddress: string;
  tokenId: string;
  price: string; // Price in ETH
  expirationDays?: number;
}

/**
 * Parameters for accepting an offer
 */
export interface AcceptOfferParams {
  orderHash: string;
  fulfillmentData: unknown;
}

/**
 * Marketplace action result
 */
export interface MarketplaceActionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Filter options for marketplace browser
 */
export interface MarketplaceFilters {
  collection?: CollectionKey;
  minPrice?: number;
  maxPrice?: number;
  traits?: Record<string, string | number>;
  sortBy?: "price_asc" | "price_desc" | "recently_listed" | "token_id";
  showOnlyListed?: boolean;
}

/**
 * Marketplace browser state
 */
export interface MarketplaceBrowserState {
  collection: CollectionKey;
  filters: MarketplaceFilters;
  items: MarketplaceItem[];
  isLoading: boolean;
  error?: string;
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Format price for display
 */
export function formatPrice(price: Price): string {
  const value = parseFloat(price.amount) / Math.pow(10, price.decimals);
  return `${value.toFixed(value < 1 ? 4 : 2)} ${price.currency}`;
}

/**
 * Format ETH from wei
 */
export function formatEthFromWei(wei: string): string {
  const value = parseFloat(wei) / 1e18;
  return value.toFixed(value < 1 ? 4 : 3);
}
