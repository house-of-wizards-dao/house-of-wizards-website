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

const giphyImageSchema = z.object({
  url: z.string().url(),
  // Animated WebP rendition: roughly a third of the GIF's size.
  webp: z.string().url().optional(),
});

const giphyGifSchema = z.object({
  id: z.string().min(1),
  title: z.string().nullish(),
  url: z.string().url(),
  username: z.string().nullish(),
  images: z.object({
    original: giphyImageSchema,
    fixed_width: giphyImageSchema.optional(),
  }),
});

const giphyResponseSchema = z.object({
  // Items are validated one by one so a single malformed GIF is skipped
  // instead of failing the whole page.
  data: z.array(z.unknown()),
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
  title: cleanTitle(gif.title ?? ""),
  platform: "giphy",
  previewUrl:
    gif.images.fixed_width?.webp ??
    gif.images.fixed_width?.url ??
    gif.images.original.url,
  downloadUrl: gif.images.original.url,
  pageUrl: gif.url,
});

/** True when the GIF was uploaded by the House of Wizards channel itself. */
const isChannelGif = (gif: GiphyGif): boolean =>
  gif.username?.toLowerCase() === giphyUsername.toLowerCase();

/** Validates each raw item, dropping malformed GIFs and other channels' GIFs. */
const parseChannelGifs = (items: readonly unknown[]): BreadfriendGif[] =>
  items.flatMap((item) => {
    const parsed = giphyGifSchema.safeParse(item);
    return parsed.success && isChannelGif(parsed.data)
      ? [toBreadfriendGif(parsed.data)]
      : [];
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
 * Never throws: if the key is missing or the first request fails it returns an
 * empty array so the page can fall back to its curated list, and if a later
 * page fails it returns the GIFs collected so far.
 */
export const fetchGiphyChannelGifs = async (): Promise<BreadfriendGif[]> => {
  const apiKey = process.env.GIPHY_API_KEY;
  if (!apiKey) {
    return [];
  }

  // Keyed by id: pages are cached independently, so a new upload between
  // revalidations can shift a GIF onto two pages.
  const gifsById = new Map<string, BreadfriendGif>();
  let offset = 0;

  try {
    while (gifsById.size < MAX_GIFS && offset < MAX_GIFS) {
      const page = await fetchPage(apiKey, offset);
      for (const gif of parseChannelGifs(page.data)) {
        gifsById.set(gif.id, gif);
      }

      const fetchedSoFar = page.pagination.offset + page.pagination.count;
      if (
        page.data.length === 0 ||
        fetchedSoFar <= offset ||
        fetchedSoFar >= page.pagination.total_count
      ) {
        break;
      }
      offset = fetchedSoFar;
    }
  } catch (error) {
    logger.error("Failed to fetch GIPHY channel GIFs", error);
  }

  return [...gifsById.values()];
};
