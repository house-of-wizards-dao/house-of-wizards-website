import type { Metadata } from "next";
import { getArtCatalog } from "@/lib/server/art";
import { ArtGallery } from "@/components/art/ArtGallery";

export const metadata: Metadata = {
  title: "Art · House of Wizards",
  description:
    "An ever-growing collection of art, stories, and imagination, funded by the House of Wizards.",
};
export default async function ArtPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const string = (key: string) =>
    typeof params[key] === "string" ? params[key] : "";
  return (
    <ArtGallery
      catalog={await getArtCatalog()}
      initialArtist={string("artist")}
      initialCollection={string("collection")}
      initialToken={string("token")}
    />
  );
}
