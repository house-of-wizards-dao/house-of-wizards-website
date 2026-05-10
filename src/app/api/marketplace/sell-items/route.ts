import { NextRequest, NextResponse } from "next/server";
import { collections, fetchWalletSellItems } from "@/lib/marketplace";
import type { CollectionKey } from "@/types/marketplace";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const isAddressLike = (value: string): boolean =>
  /^0x[a-fA-F0-9]{40}$/.test(value);

/**
 * GET /api/marketplace/sell-items
 * Fetch NFTs owned by a wallet for a collection, ordered by best active offer.
 *
 * Query params:
 * - collection: CollectionKey (required)
 * - owner: wallet address (required)
 * - limit: number (optional, default 100, max 200)
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const collectionKey = searchParams.get(
      "collection",
    ) as CollectionKey | null;
    const owner = searchParams.get("owner");
    const limitParam = searchParams.get("limit");

    if (!collectionKey || !collections[collectionKey]) {
      return NextResponse.json(
        {
          error: "Invalid or missing collection parameter",
          validCollections: Object.keys(collections),
        },
        { status: 400 },
      );
    }

    if (!owner || !isAddressLike(owner)) {
      return NextResponse.json(
        { error: "Invalid or missing owner parameter" },
        { status: 400 },
      );
    }

    let limit = 100;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 200) {
        limit = parsed;
      }
    }

    const items = await fetchWalletSellItems(collectionKey, owner, limit);

    return NextResponse.json(
      {
        collection: collections[collectionKey],
        items,
        count: items.length,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    logger.error("Error in /api/marketplace/sell-items", error);
    return NextResponse.json(
      {
        error: "Failed to fetch sell items",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
