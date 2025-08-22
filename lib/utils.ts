import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Essential for the design system to work correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values consistently across the app
 */
export function formatCurrency(
  amount: number,
  currency: string = "ETH",
  decimals: number = 4,
): string {
  return `${amount.toFixed(decimals)} ${currency}`;
}

/**
 * Format time remaining for auctions
 */
export function formatTimeRemaining(endTime: string): string {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Generate consistent avatar URLs
 */
export function getAvatarUrl(
  avatarPath: string | null,
  fallback: string = "default.png",
): string {
  const AVATAR_CDN_URL =
    "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/avatars/";

  if (!avatarPath) return `${AVATAR_CDN_URL}${fallback}`;
  if (avatarPath.startsWith("http")) return avatarPath;
  return `${AVATAR_CDN_URL}${avatarPath}`;
}

/**
 * Generate consistent artwork URLs
 */
export function getArtworkUrl(artworkPath: string): string {
  const ARTWORK_CDN_URL =
    "https://ctyeiwzxltrqyrbcbrii.supabase.co/storage/v1/object/public/files/";

  if (artworkPath.startsWith("http")) return artworkPath;
  return `${ARTWORK_CDN_URL}${artworkPath}`;
}

/**
 * Debounce function for search and other rapid inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if user is on mobile device
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(
  elementId: string,
  behavior: ScrollBehavior = "smooth",
): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
