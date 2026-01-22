/**
 * Server-side cult content fetching
 * Fetches items from the CULT_CONTENT_CHRONICLE table
 * Uses Next.js unstable_cache for data deduplication across landing page and detail pages
 */
import { unstable_cache } from "next/cache";

import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";

export type CultContentDbItem = {
  id: number;
  text: string;
  date: string; // ISO 8601 format
  author: string; // Twitter handle
  author_id?: string | null; // FK to users table
  highlight: boolean;
  title?: string | null;
  status?: "draft" | "published";
  created_at?: string;
  updated_at?: string;
};

// Cache duration in seconds (5 minutes)
const CACHE_REVALIDATE_SECONDS = 300;

/**
 * Internal function to fetch chronicle items from the database
 */
async function fetchChronicleFromDb(
  limit: number,
): Promise<CultContentDbItem[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching cult content chronicle:", error);
    throw new Error(`Failed to fetch cult content: ${error.message}`);
  }

  return data ?? [];
}

/**
 * Cached version of chronicle fetch
 * Reuses cached data across landing page and detail page requests
 */
const getCachedChronicle = unstable_cache(
  async (limit: number) => fetchChronicleFromDb(limit),
  ["cult-content-chronicle"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["cult-content"],
  },
);

/**
 * Fetches the last N published items from the cult content chronicle
 * Sorted by date (newest first)
 * Only returns items with status = 'published'
 * Results are cached for 5 minutes to avoid redundant database calls
 */
export async function fetchCultContentChronicle(
  limit: number = 20,
): Promise<CultContentDbItem[]> {
  return getCachedChronicle(limit);
}

/**
 * Internal function to fetch a single item from database
 */
async function fetchItemFromDb(id: number): Promise<CultContentDbItem | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching cult content item:", error);
    throw new Error(`Failed to fetch cult content item: ${error.message}`);
  }

  return data;
}

/**
 * Cached version of single item fetch
 */
const getCachedItem = unstable_cache(
  async (id: number) => fetchItemFromDb(id),
  ["cult-content-item"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ["cult-content"],
  },
);

/**
 * Fetches a single published news item by ID
 * First checks the cached chronicle list (already loaded by landing page)
 * Falls back to individual item cache if not found in list
 */
export async function fetchCultContentById(
  id: number,
): Promise<CultContentDbItem | null> {
  // Try to find the item in the cached chronicle list first
  // This avoids a separate DB call when navigating from landing page to detail
  try {
    const chronicleItems = await getCachedChronicle(20);
    const cachedItem = chronicleItems.find((item) => item.id === id);

    if (cachedItem) {
      return cachedItem;
    }
  } catch {
    // If chronicle fetch fails, fall through to individual fetch
  }

  // Item not in the cached list (older item or different limit) - fetch individually
  return getCachedItem(id);
}

/**
 * Extracts Twitter/X post URLs from text
 */
export function extractTwitterUrls(text: string): string[] {
  // Match twitter.com and x.com URLs
  const twitterRegex =
    /https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/g;
  const matches = text.match(twitterRegex);
  return matches ?? [];
}

/**
 * Extracts the tweet ID from a Twitter/X URL
 */
export function extractTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/);
  return match ? match[1] : null;
}
