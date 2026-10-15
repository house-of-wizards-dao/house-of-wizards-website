import type { Artwork, ArtFile } from "@/types/art";

export const coverFile = (artwork: Artwork): ArtFile | undefined =>
  artwork.files.find((f) => f.variant === "thumbnail" && f.url) ??
  artwork.files.find((f) => f.variant === "web" && f.url);

export const filterArtworks = (
  artworks: Artwork[],
  query: string,
  artist: string,
  collection: string,
  token: string,
): Artwork[] => {
  const search = query.trim().toLowerCase();
  return artworks.filter(
    (art) =>
      (!artist || art.artist_id === artist) &&
      ((!collection && !token) ||
        art.assets.some(
          (asset) =>
            (!collection || asset.collection === collection) &&
            (!token || asset.asset_identifier === token.trim()),
        )) &&
      (!search ||
        [
          art.title,
          art.description,
          art.medium,
          ...art.assets.map(
            (asset) => `${asset.collection} ${asset.asset_identifier}`,
          ),
        ].some((value) => value?.toLowerCase().includes(search))),
  );
};

/** Fisher–Yates: keep the source catalog intact and shuffle each visit once. */
export const shuffleArtworks = (
  artworks: Artwork[],
  random: () => number = Math.random,
): Artwork[] => {
  const shuffled = [...artworks];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled;
};
