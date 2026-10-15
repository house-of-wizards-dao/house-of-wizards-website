import type { Artwork } from "@/types/art";
import { filterArtworks, shuffleArtworks } from "./art";

const makeArt = (
  id: string,
  artist: string,
  tokens: [string, string][],
): Artwork => ({
  id,
  artist_id: artist,
  title: "A spell",
  description: null,
  funded: true,
  medium: "Illustration",
  external_url: null,
  files: [],
  assets: tokens.map(([collection, asset_identifier]) => ({
    id: `${collection}:${asset_identifier}`,
    collection,
    asset_identifier,
    asset_url: null,
  })),
});
const artworks = [
  makeArt("a", "shadow", [
    ["wizards", "2330"],
    ["warriors", "6318"],
  ]),
  makeArt("b", "ozzz", [["wizards", "6318"]]),
  makeArt("c", "shadow", [["warriors", "2330"]]),
];

describe("art collection filters", () => {
  it("requires the collection and token to identify the same featured asset", () => {
    expect(
      filterArtworks(artworks, "", "", "wizards", "6318").map((a) => a.id),
    ).toEqual(["b"]);
  });
  it("combines artist and token filters without confusing collections", () => {
    expect(
      filterArtworks(artworks, "", "shadow", "warriors", "2330").map(
        (a) => a.id,
      ),
    ).toEqual(["c"]);
  });
  it("matches an exact token ID rather than a partial number", () => {
    expect(filterArtworks(artworks, "", "", "", "233")).toEqual([]);
  });
  it("finds a token across collections and trims the query", () => {
    expect(
      filterArtworks(artworks, "", "", "", " 2330 ").map((a) => a.id),
    ).toEqual(["a", "c"]);
  });
});

describe("random artwork order", () => {
  it("shuffles without dropping, duplicating, or mutating the catalog", () => {
    const originalIds = artworks.map((art) => art.id);
    const shuffled = shuffleArtworks(artworks, () => 0);
    expect(shuffled.map((art) => art.id)).not.toEqual(originalIds);
    expect(shuffled.map((art) => art.id).sort()).toEqual(
      [...originalIds].sort(),
    );
    expect(artworks.map((art) => art.id)).toEqual(originalIds);
  });
});
