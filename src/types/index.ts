// Common types used throughout the application
import React from "react";

export interface Profile {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  description?: string; // Maps to 'bio' in database
  twitter?: string; // Maps to 'twitter_handle' in database
  discord?: string; // Maps to 'discord_handle' in database
  website?: string; // Maps to 'website_url' in database
  avatar_url?: string;
  user_metadata?: Record<string, unknown>;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  portfolio?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  artist_id?: string;
  created_at: string;
  tags?: string[];
}

export interface TalentMember {
  id: string;
  name: string;
  bio?: string;
  skills?: string[];
  contact?: string;
  avatar_url?: string;
  portfolio_url?: string;
  twitter?: string;
  discord?: string;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
  created_at?: string;
}

export interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormData {
  name: string;
  bio: string;
  email?: string;
  avatar?: File | null;
  [key: string]: unknown;
}

// Signup page specific types
export interface FileData {
  name: string;
  size?: number;
  description: string;
  fileType: string;
  [key: string]: unknown;
}

export interface FileDescriptions {
  [fileName: string]: string;
}

export interface FilePreviews {
  [fileName: string]: string;
}

export interface UploadProgress {
  progress: number;
  status: "uploading" | "success" | "error" | "warning";
  message?: string;
}

export interface UploadProgressState {
  [fileName: string]: UploadProgress;
}

export interface UserProfile {
  id: string;
  name?: string;
  description?: string;
  twitter?: string;
  discord?: string;
  website?: string;
  avatar_url?: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    [key: string]: unknown;
  };
}

// Gallery specific types
export interface GalleryItemData {
  name: string;
  created_at?: string;
  userId: string;
  userName: string;
  description?: string;
  fileType?: string;
  size?: number;
  [key: string]: unknown;
}

export interface DragPosition {
  x: number;
  y: number;
}

export interface ImageModalProps {
  item: GalleryItemData | null;
  onClose: () => void;
  isOpen: boolean;
}

export interface GalleryItemProps {
  item: GalleryItemData;
  onClick: (item: GalleryItemData) => void;
  priority: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

// Icon props interface
export interface IconSvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

// Re-export auction types
export * from "./auction";

// Re-export marketplace types
export * from "./marketplace";
// Import specific types for use in ContractAuction
import type { Artwork, AuctionStatus, Auction } from "./auction";

// Auction-related types
export interface ContractAuction {
  id: string;
  artwork_id: string; // Required for Auction compatibility
  artwork?: Artwork; // Populated via join - matches Auction interface
  artwork_metadata?: Record<string, any>; // For artwork metadata compatibility - matches Auction interface
  artwork_url?: string; // For Web3 compatibility (artwork image URL) - made optional to match Auction
  artist?: { name: string; image?: string }; // For artist compatibility - matches Auction interface exactly
  contract_address?: string; // For Web3 integration compatibility
  token_id?: string; // For NFT/blockchain compatibility
  start_price?: number; // For Web3 compatibility (alias for starting_bid)
  title: string;
  description: string;
  starting_bid: number;
  reserve_price?: number; // Added for Auction compatibility
  current_bid?: number; // Changed from string to optional number to match Auction
  bid_increment: number;
  min_bid_increment?: string; // in wei as string - made optional for contract compatibility
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  status: AuctionStatus; // Use AuctionStatus type to match Auction interface
  total_bids: number;
  winner_id?: string | null; // Changed from winner_address to match Auction interface, allows null
  winner_name?: string; // Computed field - added for Auction compatibility
  created_by: string;
  created_by_name?: string; // Computed field - added for Auction compatibility
  featured: boolean;
  metadata?: Record<string, any>; // Added for Auction compatibility
  created_at: string;
  updated_at: string;
  // Web3/Contract specific fields
  artist_id?: string; // Made optional since artist object is primary
  start_price_wei?: string; // in wei as string for contract compatibility
  current_bid_wei?: string; // in wei as string for contract compatibility
  winner_address?: string; // Keep for Web3 compatibility
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_address: string;
  bidder_profile?: UserProfile;
  amount: string; // in wei as string
  transaction_hash: string;
  block_number?: number;
  created_at: string;
  is_winning: boolean;
}

export interface AuctionActivity {
  id: string;
  auction_id: string;
  type: "bid" | "auction_start" | "auction_end" | "price_update";
  user_address?: string;
  user_profile?: UserProfile;
  amount?: string; // in wei for bids
  metadata?: Record<string, unknown>;
  transaction_hash?: string;
  created_at: string;
}

export interface BidFormData {
  amount: string; // ETH amount as string
}

export interface AuctionTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
  hasEnded: boolean;
}

export interface ZoomState {
  scale: number;
  x: number;
  y: number;
}

export interface AuctionPageProps {
  auction: Auction;
  initialBids: Bid[];
  initialActivity: AuctionActivity[];
}
