import { z } from "zod";
import { artistSchema, artworkSchema } from "@/types/art";
export const cmsArtistSchema = artistSchema.extend({
  updated_at: z.string(),
  profile_image_source_url: z.string().nullable(),
  avatar_url: z.string().nullable().optional(),
  commission_artist_links: z.array(
    z.object({
      id: z.string(),
      kind: z.enum([
        "portfolio",
        "twitter",
        "instagram",
        "discord",
        "tiktok",
        "other",
      ]),
      value: z.string(),
    }),
  ),
  commission_artworks: z.array(z.object({ id: z.string() })),
});
export const cmsArtworkSchema = artworkSchema.extend({
  updated_at: z.string(),
  preview_url: z.string().nullable().optional(),
  display_title: z.string().optional(),
});
export type CMSArtist = z.infer<typeof cmsArtistSchema>;
export type CMSArtwork = z.infer<typeof cmsArtworkSchema>;
