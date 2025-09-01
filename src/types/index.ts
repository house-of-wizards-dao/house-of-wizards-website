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

// Auction-related types
export interface ContractAuction {
  id: string;
  artwork_id: string; // Required for Auction compatibility
  title: string;
  description?: string;
  artwork_url: string;
  artwork_metadata?: {
    title?: string;
    medium?: string;
    dimensions?: string;
    year?: string;
  };
  artist_id: string;
  artist?: Artist;
  start_price?: number; // For Auction compatibility (alias for starting_bid)
  start_price_wei?: string; // in wei as string for contract compatibility
  starting_bid: number; // Required for Auction compatibility
  current_bid: string; // in wei as string
  bid_increment: number; // Required for Auction compatibility
  min_bid_increment: string; // in wei as string
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  status: "upcoming" | "active" | "ended" | "cancelled";
  winner_address?: string | null;
  total_bids: number;
  created_by: string; // Required for Auction compatibility
  featured: boolean; // Required for Auction compatibility
  contract_address?: string;
  token_id?: string;
  created_at: string;
  updated_at: string;
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
  auction: ContractAuction;
  initialBids: Bid[];
  initialActivity: AuctionActivity[];
}
