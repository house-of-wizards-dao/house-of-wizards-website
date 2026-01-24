import { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace";
import { PageTitle } from "@/components/PageTitle";
import { fetchCollectionListings, getCollection } from "@/lib/marketplace";

export const metadata: Metadata = {
  title: "Marketplace | House of Wizards",
  description:
    "Browse and trade Forgotten Runes characters and items. Buy Wizards, Warriors, Souls, Beasts, and more from the Runiverse.",
  openGraph: {
    title: "Marketplace | House of Wizards",
    description:
      "Browse and trade Forgotten Runes characters and items. Buy Wizards, Warriors, Souls, Beasts, and more from the Runiverse.",
  },
};

// Revalidate the page every 60 seconds
export const revalidate = 60;

export default async function MarketplacePage() {
  // Pre-fetch initial listings on the server
  // This eliminates the loading spinner on first page load
  let initialListings;
  let initialCollectionInfo;

  try {
    const result = await fetchCollectionListings("wizards", 50);
    initialListings = result.listings;
    initialCollectionInfo = getCollection("wizards");
  } catch (error) {
    console.error("Failed to prefetch listings:", error);
    // Fall back to client-side fetching if server fetch fails
    initialListings = undefined;
    initialCollectionInfo = undefined;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="Marketplace"
        subtitle="Browse and trade Forgotten Runes characters and items"
      />

      <div className="mt-8">
        <MarketplaceBrowser
          initialCollection="wizards"
          initialListings={initialListings}
          initialCollectionInfo={initialCollectionInfo}
        />
      </div>
    </div>
  );
}
