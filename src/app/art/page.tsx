import type { Metadata } from "next";
import { getArtCatalog } from "@/lib/server/art";
import { ArtGallery } from "@/components/art/ArtGallery";

export const metadata: Metadata = {
  title: "Art · House of Wizards",
  description:
    "An ever-growing collection of art, stories, and imagination, funded by the House of Wizards.",
};
export default async function ArtPage() {
  return <ArtGallery catalog={await getArtCatalog()} />;
}
