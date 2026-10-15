import { notFound } from "next/navigation";
import { getArtCatalog } from "@/lib/server/art";
import { ArtworkViewer } from "@/components/art/ArtworkViewer";
export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const catalog = await getArtCatalog();
  const artwork = catalog.artworks.find((a) => a.id === id);
  if (!artwork) notFound();
  const artist = catalog.artists.find((a) => a.id === artwork.artist_id);
  return (
    <main className="mx-auto max-w-7xl px-4">
      <ArtworkViewer artwork={artwork} artist={artist} />
    </main>
  );
}
