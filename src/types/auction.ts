// Auction system types
export type AuctionStatus = "draft" | "active" | "ended" | "cancelled";
export type BidStatus = "active" | "outbid" | "winning" | "won" | "lost";
export type ArtworkStatus = "pending" | "approved" | "rejected";

export interface Artwork {
  id: string;
  title: string;
  description: string;
  artist_id: string;
  artist_name?: string; // Computed field from join
  image_urls: string[];
  thumbnail_url: string;
  medium?: string;
  dimensions?: string;
  year_created?: number;
  edition_size?: number;
  edition_number?: number;
  provenance?: string;
  certificate_authenticity?: boolean;
  estimated_value_min?: number;
  estimated_value_max?: number;
  reserve_price?: number;
  status: ArtworkStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Auction {
  id: string;
  artwork_id: string;
  artwork?: Artwork; // Populated via join
  artwork_metadata?: Record<string, any>; // For artwork metadata compatibility
  artwork_url?: string; // For Web3 compatibility (artwork image URL)
  artist?: { name: string; image?: string }; // For artist compatibility
  contract_address?: string; // For Web3 integration compatibility
  token_id?: string; // For NFT/blockchain compatibility
  start_price?: number; // For Web3 compatibility (alias for starting_bid)
  title: string;
  description: string;
  starting_bid: number;
  reserve_price?: number;
  current_bid?: number;
  bid_increment: number;
  start_time: string;
  end_time: string;
  status: AuctionStatus;
  total_bids: number;
  winner_id?: string;
  winner_name?: string; // Computed field
  created_by: string;
  created_by_name?: string; // Computed field
  featured: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  auction_title?: string; // Populated via join
  bidder_id: string;
  bidder_name?: string; // Computed field
  amount: number;
  max_bid?: number; // For proxy bidding
  status: BidStatus;
  is_auto_bid: boolean;
  placed_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface BidHistory {
  id: string;
  auction_id: string;
  bidder_id: string;
  bidder_name?: string;
  amount: number;
  placed_at: string;
  was_winning: boolean;
}

export interface WatchlistItem {
  id: string;
  user_id: string;
  auction_id: string;
  auction_title?: string; // Populated via join
  created_at: string;
}

export interface AuctionView {
  id: string;
  auction_id: string;
  user_id?: string;
  ip_address: string;
  user_agent?: string;
  viewed_at: string;
}

// API Request/Response types
export interface CreateAuctionRequest {
  artwork_id: string;
  title: string;
  description: string;
  starting_bid: number;
  reserve_price?: number;
  bid_increment: number;
  start_time: string;
  end_time: string;
  featured?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateAuctionRequest {
  title?: string;
  description?: string;
  starting_bid?: number;
  reserve_price?: number;
  bid_increment?: number;
  start_time?: string;
  end_time?: string;
  status?: AuctionStatus;
  featured?: boolean;
  metadata?: Record<string, any>;
}

export interface PlaceBidRequest {
  amount: number;
  auction_id?: string; // Optional for context
  max_bid?: number; // For proxy bidding
}

export interface CreateArtworkRequest {
  title: string;
  description: string;
  artist_id: string;
  image_urls: string[];
  thumbnail_url: string;
  medium?: string;
  dimensions?: string;
  year_created?: number;
  edition_size?: number;
  edition_number?: number;
  provenance?: string;
  certificate_authenticity?: boolean;
  estimated_value_min?: number;
  estimated_value_max?: number;
  reserve_price?: number;
  metadata?: Record<string, any>;
}

export interface UpdateArtworkRequest {
  title?: string;
  description?: string;
  artist_id?: string;
  image_urls?: string[];
  thumbnail_url?: string;
  medium?: string;
  dimensions?: string;
  year_created?: number;
  edition_size?: number;
  edition_number?: number;
  provenance?: string;
  certificate_authenticity?: boolean;
  estimated_value_min?: number;
  estimated_value_max?: number;
  reserve_price?: number;
  status?: ArtworkStatus;
  metadata?: Record<string, any>;
}

// API Response types
export interface AuctionListResponse {
  auctions: Auction[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BidListResponse {
  bids: Bid[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuctionStatsResponse {
  total_auctions: number;
  active_auctions: number;
  total_bids: number;
  total_value: number;
  avg_auction_value: number;
  top_bidders: Array<{
    user_id: string;
    user_name: string;
    total_bids: number;
    total_amount: number;
  }>;
}

// Real-time events
export type AuctionEventType =
  | "bid_placed"
  | "auction_started"
  | "auction_ended"
  | "auction_extended"
  | "reserve_met"
  | "bid_outbid"
  | "auction_cancelled";

export interface AuctionEvent {
  type: AuctionEventType;
  auction_id: string;
  data: {
    auction?: Partial<Auction>;
    bid?: Partial<Bid>;
    message?: string;
    timestamp: string;
  };
}

// Filter and search types
export interface AuctionFilters {
  status?: AuctionStatus[];
  artist_id?: string;
  created_by?: string;
  price_min?: number;
  price_max?: number;
  start_date?: string;
  end_date?: string;
  featured?: boolean;
  has_reserve?: boolean;
  category?: string;
}

export interface AuctionSearchParams {
  query?: string;
  filters?: AuctionFilters;
  sort_by?:
    | "created_at"
    | "start_time"
    | "end_time"
    | "current_bid"
    | "total_bids";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Utility types
export interface AuctionTimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total_seconds: number;
  is_ended: boolean;
  is_starting_soon: boolean;
}

export interface BidValidationResult {
  is_valid: boolean;
  errors: string[];
  suggested_bid?: number;
  min_increment?: number;
}
