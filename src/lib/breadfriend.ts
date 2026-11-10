// Server-side fetch of the House of Wizards GIFs from the GIPHY API.
//
// GIPHY has no public "list a user's uploads" endpoint, but a username search
// (q=@<username>) returns exactly that channel's GIFs. New uploads appear
// automatically, so the /breadfriend page never needs a hand-maintained list.
//
// Requires the server-only GIPHY_API_KEY env var. If it is missing or the
// request fails, the caller falls back to `breadfriendFallbackGifs`.

import { z } from "zod";
import { giphyUsername, type BreadfriendGif } from "@/data/breadfriend";
import { logger } from "@/lib/logger";

const GIPHY_SEARCH_ENDPOINT = "https://api.giphy.com/v1/gifs/search";
const PAGE_SIZE = 50; // GIPHY search maximum.
const MAX_GIFS = 500; // Safety cap on pagination.
const REVALIDATE_SECONDS = 3600;

const giphyImageSchema = z.object({ url: z.string().url() });

const giphyGifSchema = z.object({
  id: z.string().min(1),
  title: z.string().default(""),
  url: z.string().url(),
  username: z.string().default(""),
  images: z.object({
    original: giphyImageSchema,
    fixed_width: giphyImageSchema.optional(),
  }),
});

const giphyResponseSchema = z.object({
  data: z.array(giphyGifSchema),
  pagination: z.object({
    total_count: z.number(),
    count: z.number(),
    offset: z.number(),
  }),
});

type GiphyGif = z.infer<typeof giphyGifSchema>;

/** Strips GIPHY's auto-appended " GIF by <channel>" suffix from a title. */
const cleanTitle = (rawTitle: string): string => {
  const cleaned = rawTitle.replace(/\s*GIF( by .*)?$/i, "").trim();
  return cleaned.length > 0 ? cleaned : "House of Wizards GIF";
};

const toBreadfriendGif = (gif: GiphyGif): BreadfriendGif => ({
  id: gif.id,
  title: cleanTitle(gif.title),
  platform: "giphy",
  previewUrl: gif.images.fixed_width?.url ?? gif.images.original.url,
  downloadUrl: gif.images.original.url,
  pageUrl: gif.url,
});

const fetchPage = async (
  apiKey: string,
  offset: number,
): Promise<z.infer<typeof giphyResponseSchema>> => {
  const params = new URLSearchParams({
    api_key: apiKey,
    q: `@${giphyUsername}`,
    limit: String(PAGE_SIZE),
    offset: String(offset),
    rating: "pg-13",
    bundle: "messaging_non_clips",
  });

  const response = await fetch(
    `${GIPHY_SEARCH_ENDPOINT}?${params.toString()}`,
    {
      next: { revalidate: REVALIDATE_SECONDS },
    },
  );

  if (!response.ok) {
    throw new Error(`GIPHY request failed with status ${response.status}`);
  }

  const json: unknown = await response.json();
  return giphyResponseSchema.parse(json);
};

/**
 * Fetches every GIF on the House of Wizards GIPHY channel, paginating as needed.
 * Returns an empty array (never throws) if the key is missing or a request fails,
 * so the page can fall back to its curated list.
 */
export const fetchGiphyChannelGifs = async (): Promise<BreadfriendGif[]> => {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const gifs: BreadfriendGif[] = [];
    let offset = 0;

    while (gifs.length < MAX_GIFS) {
      const page = await fetchPage(apiKey, offset);
      gifs.push(...page.data.map(toBreadfriendGif));

      const fetchedSoFar = page.pagination.offset + page.pagination.count;
      if (
        page.data.length === 0 ||
        fetchedSoFar >= page.pagination.total_count
      ) {
        break;
      }
      offset = fetchedSoFar;
    }

    return gifs;
  } catch (error) {
    logger.error("Failed to fetch GIPHY channel GIFs", error);
    return [];
  }
};
