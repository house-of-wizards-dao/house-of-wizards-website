// Common types used throughout the application
import React from "react";

export interface Profile {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  bio?: string;
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
