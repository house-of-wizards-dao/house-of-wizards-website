// Called from the gallery's client effect: GIPHY requires direct browser
// requests without response caching, filtering, or reordering.
// https://developers.giphy.com/docs/api/#best-practices

import { z } from "zod";
import { giphyUsername, type BreadfriendGif } from "@/data/breadfriend";

const GIPHY_SEARCH_ENDPOINT = "https://api.giphy.com/v1/gifs/search";
const PAGE_SIZE = 50;
const MAX_GIFS = 500;
const LOAD_TIMEOUT_MS = 8000;

const optionalImageUrl = z.string().url().optional().catch(undefined);
const giphyGifSchema = z.object({
  id: z.string().min(1),
  title: z.string().nullish(),
  url: z.string().url(),
  images: z.object({
    original: z.object({ url: z.string().url() }),
    fixed_width: z
      .object({ url: optionalImageUrl, webp: optionalImageUrl })
      .optional()
      .catch(undefined),
  }),
});

const giphyResponseSchema = z.object({
  data: z.array(giphyGifSchema),
  pagination: z.object({
    total_count: z.number().int().nonnegative(),
    count: z.number().int().nonnegative(),
    offset: z.number().int().nonnegative(),
  }),
});

type GiphyGif = z.infer<typeof giphyGifSchema>;

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

const fetchPage = async (
  apiKey: string,
  offset: number,
  signal: AbortSignal,
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
    { cache: "no-store", signal },
  );
  if (!response.ok) {
    throw new Error(`GIPHY request failed with status ${response.status}`);
  }

  const json: unknown = await response.json();
  return giphyResponseSchema.parse(json);
};

/**
 * Load the channel in GIPHY's response order, with one deadline for all pages.
 * Returns collected results on failure (or [] for the channel-link fallback).
 * The caller's signal cancels requests when the gallery is unmounted.
 */
export const fetchGiphyChannelGifs = async (
  signal?: AbortSignal,
): Promise<BreadfriendGif[]> => {
  const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
  if (!apiKey || signal?.aborted) return [];

  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  const timeout = setTimeout(abort, LOAD_TIMEOUT_MS);
  const gifs: BreadfriendGif[] = [];
  let offset = 0;

  try {
    while (offset < MAX_GIFS && !controller.signal.aborted) {
      const page = await fetchPage(apiKey, offset, controller.signal);
      // Channel selection belongs in the API query. Preserve every returned
      // entry and its media URLs, including their query parameters.
      gifs.push(...page.data.map(toBreadfriendGif));

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
  } catch {
    // Network failures, aborts and invalid responses leave channel links usable.
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }

  return gifs;
};
