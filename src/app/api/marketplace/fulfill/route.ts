import { NextRequest, NextResponse } from "next/server";
import { OrderSide } from "opensea-js";
import { encodeFunctionData } from "viem";
import { getOpenSeaSDK, collections } from "@/lib/marketplace";
import type { CollectionKey } from "@/types/marketplace";

export const dynamic = "force-dynamic";

// Seaport 1.6 protocol address on mainnet
const SEAPORT_ADDRESS = "0x0000000000000068F116a894984e2DB1123eB395";

// Minimal Seaport ABI for the functions we need to encode
const SEAPORT_ABI = [
  {
    name: "fulfillBasicOrder_efficient_6GL6yc",
    type: "function",
    inputs: [
      {
        name: "parameters",
        type: "tuple",
        components: [
          { name: "considerationToken", type: "address" },
          { name: "considerationIdentifier", type: "uint256" },
          { name: "considerationAmount", type: "uint256" },
          { name: "offerer", type: "address" },
          { name: "zone", type: "address" },
          { name: "offerToken", type: "address" },
          { name: "offerIdentifier", type: "uint256" },
          { name: "offerAmount", type: "uint256" },
          { name: "basicOrderType", type: "uint8" },
          { name: "startTime", type: "uint256" },
          { name: "endTime", type: "uint256" },
          { name: "zoneHash", type: "bytes32" },
          { name: "salt", type: "uint256" },
          { name: "offererConduitKey", type: "bytes32" },
          { name: "fulfillerConduitKey", type: "bytes32" },
          { name: "totalOriginalAdditionalRecipients", type: "uint256" },
          {
            name: "additionalRecipients",
            type: "tuple[]",
            components: [
              { name: "amount", type: "uint256" },
              { name: "recipient", type: "address" },
            ],
          },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
  },
  {
    name: "fulfillBasicOrder",
    type: "function",
    inputs: [
      {
        name: "parameters",
        type: "tuple",
        components: [
          { name: "considerationToken", type: "address" },
          { name: "considerationIdentifier", type: "uint256" },
          { name: "considerationAmount", type: "uint256" },
          { name: "offerer", type: "address" },
          { name: "zone", type: "address" },
          { name: "offerToken", type: "address" },
          { name: "offerIdentifier", type: "uint256" },
          { name: "offerAmount", type: "uint256" },
          { name: "basicOrderType", type: "uint8" },
          { name: "startTime", type: "uint256" },
          { name: "endTime", type: "uint256" },
          { name: "zoneHash", type: "bytes32" },
          { name: "salt", type: "uint256" },
          { name: "offererConduitKey", type: "bytes32" },
          { name: "fulfillerConduitKey", type: "bytes32" },
          { name: "totalOriginalAdditionalRecipients", type: "uint256" },
          {
            name: "additionalRecipients",
            type: "tuple[]",
            components: [
              { name: "amount", type: "uint256" },
              { name: "recipient", type: "address" },
            ],
          },
          { name: "signature", type: "bytes" },
        ],
      },
    ],
  },
  {
    name: "fulfillOrder",
    type: "function",
    inputs: [
      {
        name: "order",
        type: "tuple",
        components: [
          {
            name: "parameters",
            type: "tuple",
            components: [
              { name: "offerer", type: "address" },
              { name: "zone", type: "address" },
              {
                name: "offer",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                ],
              },
              {
                name: "consideration",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                  { name: "recipient", type: "address" },
                ],
              },
              { name: "orderType", type: "uint8" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "zoneHash", type: "bytes32" },
              { name: "salt", type: "uint256" },
              { name: "conduitKey", type: "bytes32" },
              { name: "totalOriginalConsiderationItems", type: "uint256" },
            ],
          },
          { name: "signature", type: "bytes" },
        ],
      },
      { name: "fulfillerConduitKey", type: "bytes32" },
    ],
  },
  {
    name: "fulfillAdvancedOrder",
    type: "function",
    inputs: [
      {
        name: "advancedOrder",
        type: "tuple",
        components: [
          {
            name: "parameters",
            type: "tuple",
            components: [
              { name: "offerer", type: "address" },
              { name: "zone", type: "address" },
              {
                name: "offer",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                ],
              },
              {
                name: "consideration",
                type: "tuple[]",
                components: [
                  { name: "itemType", type: "uint8" },
                  { name: "token", type: "address" },
                  { name: "identifierOrCriteria", type: "uint256" },
                  { name: "startAmount", type: "uint256" },
                  { name: "endAmount", type: "uint256" },
                  { name: "recipient", type: "address" },
                ],
              },
              { name: "orderType", type: "uint8" },
              { name: "startTime", type: "uint256" },
              { name: "endTime", type: "uint256" },
              { name: "zoneHash", type: "bytes32" },
              { name: "salt", type: "uint256" },
              { name: "conduitKey", type: "bytes32" },
              { name: "totalOriginalConsiderationItems", type: "uint256" },
            ],
          },
          { name: "numerator", type: "uint120" },
          { name: "denominator", type: "uint120" },
          { name: "signature", type: "bytes" },
          { name: "extraData", type: "bytes" },
        ],
      },
      {
        name: "criteriaResolvers",
        type: "tuple[]",
        components: [
          { name: "orderIndex", type: "uint256" },
          { name: "side", type: "uint8" },
          { name: "index", type: "uint256" },
          { name: "identifier", type: "uint256" },
          { name: "criteriaProof", type: "bytes32[]" },
        ],
      },
      { name: "fulfillerConduitKey", type: "bytes32" },
      { name: "recipient", type: "address" },
    ],
  },
] as const;

/**
 * Encode the transaction calldata based on the function name and input data
 */
const encodeSeaportCall = (
  functionName: string,
  inputData: Record<string, unknown>,
): `0x${string}` => {
  // Extract the base function name (remove parameter signature if present)
  // e.g., "fulfillAdvancedOrder((address,...))" -> "fulfillAdvancedOrder"
  const baseFunctionName = functionName.split("(")[0];

  // Map OpenSea's function names to our ABI
  let normalizedFn: string;
  if (baseFunctionName.includes("efficient")) {
    normalizedFn = "fulfillBasicOrder_efficient_6GL6yc";
  } else if (baseFunctionName === "fulfillAdvancedOrder") {
    normalizedFn = "fulfillAdvancedOrder";
  } else if (baseFunctionName === "fulfillBasicOrder") {
    normalizedFn = "fulfillBasicOrder";
  } else if (baseFunctionName === "fulfillOrder") {
    normalizedFn = "fulfillOrder";
  } else {
    normalizedFn = baseFunctionName;
  }

  // Find the matching ABI entry
  const abiEntry = SEAPORT_ABI.find((entry) => entry.name === normalizedFn);
  if (!abiEntry) {
    throw new Error(`Unknown Seaport function: ${functionName}`);
  }

  // Prepare the arguments based on the function
  let args: unknown[];

  if (
    normalizedFn === "fulfillBasicOrder_efficient_6GL6yc" ||
    normalizedFn === "fulfillBasicOrder"
  ) {
    // For basic orders, the input_data contains basicOrderParameters directly
    const params = inputData.basicOrderParameters || inputData.parameters;
    args = [params];
  } else if (normalizedFn === "fulfillAdvancedOrder") {
    // For advanced orders
    args = [
      inputData.advancedOrder,
      inputData.criteriaResolvers || [],
      inputData.fulfillerConduitKey ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      inputData.recipient,
    ];
  } else if (normalizedFn === "fulfillOrder") {
    // For regular orders
    args = [
      inputData.order,
      inputData.fulfillerConduitKey ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    ];
  } else {
    throw new Error(`Unhandled Seaport function: ${normalizedFn}`);
  }

  return encodeFunctionData({
    abi: SEAPORT_ABI,
    functionName: normalizedFn,
    args: args as never,
  });
};

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
      console.error(
        "Unexpected fulfillment response structure:",
        JSON.stringify(fulfillmentResponse, null, 2),
      );
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
    console.error("Error in /api/marketplace/fulfill:", error);
    return NextResponse.json(
      {
        error: "Failed to get fulfillment data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
