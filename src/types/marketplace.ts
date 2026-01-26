/**
 * Marketplace types for OpenSea and NFTX integration
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
 * Marketplace source for listings
 */
export type MarketplaceSource = "opensea" | "nftx";

/**
 * NFTX vault configuration
 */
export interface NFTXVaultConfig {
  vaultId: number;
  vaultAddress: string;
  vTokenAddress: string;
  collectionKey: CollectionKey;
  name: string;
  symbol: string;
}

/**
 * NFTX vault holdings (NFTs in the pool)
 */
export interface NFTXHolding {
  tokenId: string;
  amount: number;
  dateAdded: number;
}

/**
 * NFTX vault data from subgraph
 */
export interface NFTXVaultData {
  vault: NFTXVaultConfig;
  holdings: NFTXHolding[];
  totalHoldings: number;
  fees: {
    mintFee: string; // Percentage in wei (e.g., "50000000000000000" = 5%)
    redeemFee: string;
    swapFee: string;
  };
  usesFactoryFees: boolean;
}

/**
 * NFTX listing (an NFT available in a pool)
 */
export interface NFTXListing {
  source: "nftx";
  vaultAddress: string;
  tokenId: string;
  /** Price in ETH (includes fees) */
  priceEth: string;
  /** Raw vToken price without fees */
  vTokenPriceEth: string;
  /** Fee in ETH */
  feeEth: string;
  /** When the NFT was added to the pool */
  dateAdded: number;
}

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
  display_type?:
    | "number"
    | "boost_percentage"
    | "boost_number"
    | "author"
    | "date"
    | null;
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
  /** NFTX listing if available from pool */
  nftxListing?: NFTXListing;
  /** Primary marketplace source for this item */
  source?: MarketplaceSource;
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
export function formatEthFromWei(wei: string | undefined | null): string {
  if (!wei) return "0";
  const value = parseFloat(wei) / 1e18;
  if (isNaN(value)) return "0";
  return value.toFixed(value < 1 ? 4 : 3);
}
