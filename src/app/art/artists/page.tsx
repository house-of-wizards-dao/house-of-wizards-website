import { getArtCatalog } from "@/lib/server/art";
import { ArtGallery } from "@/components/art/ArtGallery";
export const metadata = { title: "Artists · House of Wizards" };
export default async function ArtistsPage() {
  return <ArtGallery catalog={await getArtCatalog()} directory />;
}
