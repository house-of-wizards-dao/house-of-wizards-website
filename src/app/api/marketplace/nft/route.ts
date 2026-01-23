import { NextRequest, NextResponse } from "next/server";
import { fetchNFTDetails, collections } from "@/lib/marketplace";
import type { CollectionKey } from "@/types/marketplace";

export const dynamic = "force-dynamic";

/**
 * GET /api/marketplace/nft
 * Fetch details for a specific NFT including listings and offers
 *
 * Query params:
 * - collection: CollectionKey (required)
 * - tokenId: string (required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const collectionKey = searchParams.get(
      "collection",
    ) as CollectionKey | null;
    const tokenId = searchParams.get("tokenId");

    // Validate collection
    if (!collectionKey || !collections[collectionKey]) {
      return NextResponse.json(
        {
          error: "Invalid or missing collection parameter",
          validCollections: Object.keys(collections),
        },
        { status: 400 },
      );
    }

    // Validate tokenId
    if (!tokenId) {
      return NextResponse.json(
        { error: "tokenId parameter is required" },
        { status: 400 },
      );
    }

    // Fetch NFT details with listings and offers
    const item = await fetchNFTDetails(collectionKey, tokenId);

    if (!item) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        item,
        listingsCount: item.listings.length,
        offersCount: item.offers.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
        },
      },
    );
  } catch (error) {
    console.error("Error in /api/marketplace/nft:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch NFT details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
