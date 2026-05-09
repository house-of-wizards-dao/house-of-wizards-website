import { NextRequest, NextResponse } from "next/server";
import { OrderSide } from "opensea-js";
import { getOpenSeaSDK, collections } from "@/lib/marketplace";
import { SEAPORT_ADDRESS, encodeSeaportCall } from "@/lib/seaport-encode";
import type { CollectionKey } from "@/types/marketplace";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/marketplace/fulfill
 * Get fulfillment data for an order (used to buy or accept offer)
 *
 * Body:
 * - orderHash: string (required)
 * - collection: CollectionKey (required)
 * - tokenId: string (required)
 * - accountAddress: string (required) - buyer/seller address
 * - side: "listing" | "offer" (required) - whether this is a listing or offer
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const {
      orderHash,
      collection: collectionKey,
      tokenId,
      accountAddress,
      side = "listing",
    } = body;

    // Validate required fields
    if (!orderHash) {
      return NextResponse.json(
        { error: "orderHash is required" },
        { status: 400 },
      );
    }

    if (!collectionKey || !collections[collectionKey as CollectionKey]) {
      return NextResponse.json(
        { error: "Invalid collection" },
        { status: 400 },
      );
    }

    if (!tokenId) {
      return NextResponse.json(
        { error: "tokenId is required" },
        { status: 400 },
      );
    }

    if (!accountAddress) {
      return NextResponse.json(
        { error: "accountAddress is required" },
        { status: 400 },
      );
    }

    const sdk = getOpenSeaSDK();
    const collectionInfo = collections[collectionKey as CollectionKey];

    // Determine the order side
    const orderSide = side === "offer" ? OrderSide.OFFER : OrderSide.LISTING;

    // Get the order fulfillment data from OpenSea
    const fulfillmentResponse = await sdk.api.generateFulfillmentData(
      accountAddress,
      orderHash,
      SEAPORT_ADDRESS,
      orderSide,
      collectionInfo.address,
      tokenId,
    );

    // The response structure is: { protocol, fulfillment_data: { transaction, orders } }
    const fulfillmentData = fulfillmentResponse.fulfillment_data;
    if (!fulfillmentData?.transaction) {
      logger.error("Unexpected fulfillment response structure", {
        fulfillmentResponse,
      });
      return NextResponse.json(
        { error: "Invalid fulfillment response from OpenSea" },
        { status: 500 },
      );
    }

    const txInfo = fulfillmentData.transaction;

    // Encode the transaction calldata
    const encodedData = encodeSeaportCall(
      txInfo.function,
      txInfo.input_data as Record<string, unknown>,
    );

    // Return the transaction in a format ready for wallet signing
    return NextResponse.json({
      success: true,
      transaction: {
        to: txInfo.to,
        data: encodedData,
        value: txInfo.value || "0",
      },
      protocol: fulfillmentResponse.protocol,
      message: "Transaction data ready for signing",
    });
  } catch (error) {
    logger.error("Error in /api/marketplace/fulfill", error);
    return NextResponse.json(
      {
        error: "Failed to get fulfillment data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
