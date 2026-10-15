import { z } from "zod";

export const artFileSchema = z.object({
  id: z.string(),
  original_filename: z.string(),
  variant: z.enum(["original", "web", "thumbnail"]),
  original_file_id: z.string().nullable(),
  page_number: z.number().nullable(),
  bucket_id: z.string(),
  object_path: z.string(),
  mime_type: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  byte_size: z.number(),
});
export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  portfolio_url: z.string().nullable(),
  profile_image_bucket: z.string().nullable(),
  profile_image_path: z.string().nullable(),
});
export const artworkSchema = z.object({
  id: z.string(),
  artist_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  funded: z.boolean(),
  medium: z.string().nullable(),
  external_url: z.string().nullable(),
  featured_assets_source_text: z.string().nullable(),
  commission_artwork_files: z.array(artFileSchema),
  commission_artwork_rune_assets: z.array(
    z.object({
      commission_rune_assets: z.object({
        id: z.string(),
        collection: z.string(),
        asset_identifier: z.string(),
        asset_url: z.string().nullable(),
      }),
    }),
  ),
});
export type ArtFile = z.infer<typeof artFileSchema> & { url: string | null };
export type ArtArtist = z.infer<typeof artistSchema> & {
  avatarUrl: string | null;
};
export type RuneAsset = z.infer<
  typeof artworkSchema
>["commission_artwork_rune_assets"][number]["commission_rune_assets"];
export type Artwork = Omit<
  z.infer<typeof artworkSchema>,
  | "commission_artwork_files"
  | "commission_artwork_rune_assets"
  | "featured_assets_source_text"
> & { files: ArtFile[]; assets: RuneAsset[] };
export type ArtCatalog = { artists: ArtArtist[]; artworks: Artwork[] };
