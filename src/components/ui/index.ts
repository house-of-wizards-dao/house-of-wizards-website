/**
 * Design System Component Library Index
 *
 * This file exports all unified UI components following the design system.
 * Import components from here to ensure consistency across the application.
 *
 * Usage:
 * import { ErrorMessage, SuccessMessage } from '@/components/ui'
 * import { LazyImage } from '@/components/ui/LazyImage'
 */

// Toast notification components
export { default as ErrorMessage } from "./ErrorMessage";
export { default as SuccessMessage } from "./SuccessMessage";

// NFT display components
export { NFTCard, NFTCardSkeleton } from "./NFTCard";

// Note: LazyImage is imported directly from its file, not through this index
// import { LazyImage } from '@/components/ui/LazyImage'
