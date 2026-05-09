import { Metadata } from "next";
import { MarketplaceBrowser } from "@/components/marketplace";
import { PageTitle } from "@/components/PageTitle";
import {
  fetchCollectionListings,
  getCollection,
  withTimeout,
  TimeoutError,
} from "@/lib/marketplace";
import { CartProvider } from "@/contexts/CartContext";
import { logger } from "@/lib/logger";

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

  // Cap SSR fetch latency. ethers' FetchRequest (used inside opensea-js)
  // defaults to a 5-minute timeout, which would block this render when
  // OpenSea is slow. If we don't get listings in time, we fall through to
  // the client-side fetch path so the page renders quickly with a spinner.
  const SSR_FETCH_TIMEOUT_MS = 12_000;
  try {
    const result = await withTimeout(
      fetchCollectionListings("wizards", 50),
      SSR_FETCH_TIMEOUT_MS,
      "fetchCollectionListings(wizards)",
    );
    initialListings = result.listings;
    initialCollectionInfo = getCollection("wizards");
  } catch (error) {
    if (error instanceof TimeoutError) {
      logger.warn(
        "Marketplace SSR prefetch timed out; falling back to client fetch.",
      );
    } else {
      logger.error("Failed to prefetch listings", error);
    }
    initialListings = undefined;
    initialCollectionInfo = undefined;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle
        title="Marketplace"
        subtitle="Browse and trade Forgotten Runes characters and items"
      />

      <p className="mt-4 text-sm text-gray-400">
        Using this marketplace is your responsibility; always verify each trade
        by checking what you sign in your wallet.
      </p>

      <div className="mt-8">
        <CartProvider>
          <MarketplaceBrowser
            initialCollection="wizards"
            initialListings={initialListings}
            initialCollectionInfo={initialCollectionInfo}
          />
        </CartProvider>
      </div>
    </div>
  );
}
