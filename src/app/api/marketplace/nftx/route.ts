import { NextRequest, NextResponse } from "next/server";
import {
  fetchNFTXListings,
  getNFTXVault,
  getNFTXBuyTransaction,
} from "@/lib/nftx";
import { collections } from "@/lib/marketplace";
import type { CollectionKey } from "@/types/marketplace";

// Revalidate every 2 minutes (NFTX pool changes less frequently)
export const revalidate = 120;

/**
 * GET /api/marketplace/nftx
 * Fetch NFTX pool listings for a collection
 *
 * Query params:
 * - collection: CollectionKey (required)
 */
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const collectionKey = searchParams.get(
      "collection",
    ) as CollectionKey | null;

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

    // Check if collection has an NFTX vault
    const vault = getNFTXVault(collectionKey);
    if (!vault) {
      return NextResponse.json(
        {
          collection: collections[collectionKey],
          listings: [],
          hasVault: false,
          message: "No NFTX vault available for this collection",
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
          },
        },
      );
    }

    // Fetch NFTX listings (uses local wizard data for images/names)
    const items = await fetchNFTXListings(collectionKey);

    return NextResponse.json(
      {
        collection: collections[collectionKey],
        vault: {
          address: vault.vaultAddress,
          symbol: vault.symbol,
          name: vault.name,
        },
        listings: items,
        count: items.length,
        hasVault: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("Error in /api/marketplace/nftx:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch NFTX listings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};

/**
 * POST /api/marketplace/nftx
 * Get transaction data for buying from the NFTX pool
 *
 * Body:
 * - collection: CollectionKey (required)
 * - tokenIds: string[] (required) - NFT token IDs to buy
 * - action: "buy" (required)
 * - buyerAddress: string (required)
 * - priceWei: string (required) - raw NFTX listing price used by the UI
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      collection: collectionKey,
      tokenIds,
      action,
      buyerAddress,
      priceWei,
    } = body as {
      collection: CollectionKey;
      tokenIds: string[];
      action?: "buy";
      buyerAddress?: string;
      priceWei?: string;
    };

    // Validate inputs
    if (!collectionKey || !collections[collectionKey]) {
      return NextResponse.json(
        { error: "Invalid or missing collection" },
        { status: 400 },
      );
    }

    if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
      return NextResponse.json(
        { error: "tokenIds must be a non-empty array" },
        { status: 400 },
      );
    }

    if (action !== "buy") {
      return NextResponse.json(
        { error: "Unsupported NFTX action" },
        { status: 400 },
      );
    }

    if (!buyerAddress) {
      return NextResponse.json(
        { error: "buyerAddress is required for buy action" },
        { status: 400 },
      );
    }

    if (!priceWei) {
      return NextResponse.json(
        { error: "priceWei is required for buy action" },
        { status: 400 },
      );
    }

    const transaction = await getNFTXBuyTransaction(
      collectionKey,
      tokenIds,
      buyerAddress,
      priceWei,
    );

    if (!transaction) {
      return NextResponse.json(
        { error: "Failed to generate buy transaction" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Error in POST /api/marketplace/nftx:", error);
    return NextResponse.json(
      {
        error: "Failed to process NFTX request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
