/**
 * Server-side cult content fetching
 * Fetches items from the CULT_CONTENT_CHRONICLE table
 */
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";

export type CultContentDbItem = {
  id: number;
  text: string;
  date: string; // ISO 8601 format
  author: string; // Twitter handle
  highlight: boolean;
  title?: string | null;
  created_at?: string;
};

/**
 * Fetches the last N items from the cult content chronicle
 * Sorted by date (newest first)
 */
export async function fetchCultContentChronicle(
  limit: number = 20,
): Promise<CultContentDbItem[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .select("*")
    .order("date", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching cult content chronicle:", error);
    throw new Error(`Failed to fetch cult content: ${error.message}`);
  }

  return data ?? [];
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

