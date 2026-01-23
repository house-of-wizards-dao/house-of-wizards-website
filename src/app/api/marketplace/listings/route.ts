import { NextRequest, NextResponse } from "next/server";
import { fetchCollectionListings, collections } from "@/lib/marketplace";
import type { CollectionKey } from "@/types/marketplace";

export const dynamic = "force-dynamic";

/**
 * GET /api/marketplace/listings
 * Fetch listings for a collection
 *
 * Query params:
 * - collection: CollectionKey (required)
 * - limit: number (optional, default 50, max 100)
 * - next: string (optional, cursor for pagination)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const collectionKey = searchParams.get(
      "collection",
    ) as CollectionKey | null;
    const limitParam = searchParams.get("limit");
    const next = searchParams.get("next");

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

    // Parse and validate limit
    let limit = 50;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
        limit = parsed;
      }
    }

    // Fetch listings
    const result = await fetchCollectionListings(
      collectionKey,
      limit,
      next || undefined,
    );

    return NextResponse.json(
      {
        collection: collections[collectionKey],
        listings: result.listings,
        next: result.next || null,
        count: result.listings.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    console.error("Error in /api/marketplace/listings:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch listings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
