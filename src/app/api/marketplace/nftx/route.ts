import { NextRequest, NextResponse } from "next/server";
import {
  fetchNFTXListings,
  getNFTXVault,
  getNFTXBuyQuote,
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
 * Get buy quote or transaction data for NFTX pool
 *
 * Body:
 * - collection: CollectionKey (required)
 * - tokenIds: string[] (required) - NFT token IDs to buy
 * - action: "quote" | "buy" (optional, default "quote")
 * - buyerAddress: string (required if action is "buy")
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      collection: collectionKey,
      tokenIds,
      action = "quote",
      buyerAddress,
    } = body as {
      collection: CollectionKey;
      tokenIds: string[];
      action?: "quote" | "buy";
      buyerAddress?: string;
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

    // Get quote first
    const quote = await getNFTXBuyQuote(collectionKey, tokenIds);

    if (!quote) {
      return NextResponse.json(
        {
          error:
            "Unable to get quote - vault may not exist or have no liquidity",
        },
        { status: 400 },
      );
    }

    // If action is "buy", also return transaction data
    if (action === "buy") {
      if (!buyerAddress) {
        return NextResponse.json(
          { error: "buyerAddress is required for buy action" },
          { status: 400 },
        );
      }

      const transaction = await getNFTXBuyTransaction(
        collectionKey,
        tokenIds,
        buyerAddress,
      );

      if (!transaction) {
        return NextResponse.json(
          { error: "Failed to generate buy transaction" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        quote: {
          ...quote,
          tokenIds,
          collection: collectionKey,
        },
        transaction,
      });
    }

    // Return quote only
    return NextResponse.json({
      success: true,
      quote: {
        ...quote,
        tokenIds,
        collection: collectionKey,
      },
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
