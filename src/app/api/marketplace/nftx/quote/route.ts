import { NextRequest, NextResponse } from "next/server";
import { quoteNFTXBatch } from "@/lib/nftx";
import { collections } from "@/lib/marketplace";
import type { CollectionKey } from "@/types/marketplace";

export const dynamic = "force-dynamic";

/**
 * POST /api/marketplace/nftx/quote
 *
 * Returns a fresh atomic batch quote for the NFTX pool of a collection.
 *
 * Body:
 * - collection: CollectionKey (required)
 * - count: number (required) - number of NFTs intended to be bought atomically
 *
 * Response:
 * - totalWei / totalEth: WETH cost for `count` NFTs in a single batch
 * - marginalNextWei / marginalNextEth: incremental WETH cost to add one more
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { collection: collectionKey, count } = body as {
      collection: CollectionKey;
      count: number;
    };

    if (!collectionKey || !collections[collectionKey]) {
      return NextResponse.json(
        { error: "Invalid or missing collection" },
        { status: 400 },
      );
    }

    if (typeof count !== "number" || !Number.isFinite(count) || count < 0) {
      return NextResponse.json(
        { error: "count must be a non-negative number" },
        { status: 400 },
      );
    }

    const quote = await quoteNFTXBatch(collectionKey, count);
    if (!quote) {
      return NextResponse.json(
        { error: "No NFTX vault available or quote failed" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error("Error in POST /api/marketplace/nftx/quote:", error);
    return NextResponse.json(
      {
        error: "Failed to compute NFTX batch quote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
