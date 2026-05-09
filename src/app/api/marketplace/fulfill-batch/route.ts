import { NextRequest, NextResponse } from "next/server";
import { OrderSide } from "opensea-js";
import { getOpenSeaSDK, collections } from "@/lib/marketplace";
import { SEAPORT_ADDRESS, encodeSeaportCall } from "@/lib/seaport-encode";
import type { CollectionKey } from "@/types/marketplace";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

type FulfillBatchOrder = {
  orderHash: string;
  /** Optional tokenId. Resolved from the order's protocol_data if omitted. */
  tokenId?: string;
};

type FulfillBatchBody = {
  collection: CollectionKey;
  orders: FulfillBatchOrder[];
  accountAddress: string;
};

type Tx = { to: string; data: string; value: string };

type SDK = ReturnType<typeof getOpenSeaSDK>;

/**
 * Resolve the on-chain tokenId for an order from its protocol_data.
 * For our marketplace listings the offer is always a single ERC721/ERC1155
 * item, so the identifier of `offer[0]` is what we need.
 */
const getTokenIdFromOrder = (order: {
  protocol_data?: {
    parameters?: { offer?: Array<{ identifierOrCriteria?: unknown }> };
  };
}): string | null => {
  const id = order.protocol_data?.parameters?.offer?.[0]?.identifierOrCriteria;
  if (id === undefined || id === null) return null;
  return String(id);
};

/**
 * Resolve the tokenId to use when calling `generateFulfillmentData`.
 * Prefers an explicit hint from the cart, otherwise pulls it out of the
 * order's protocol_data (one round-trip to OpenSea per order).
 */
const resolveTokenId = async (
  sdk: SDK,
  orderHash: string,
  hint: string | undefined,
): Promise<string> => {
  if (hint) return hint;
  const order = await sdk.api.getOrderByHash(orderHash, SEAPORT_ADDRESS);
  if (!order || !order.protocol_data) {
    throw new Error(`Missing protocol data for order ${orderHash}`);
  }
  const resolved = getTokenIdFromOrder(order);
  if (!resolved) {
    throw new Error(
      `Could not resolve tokenId for order ${orderHash}; order has no offer item`,
    );
  }
  return resolved;
};

/**
 * Build a single-order fulfillment transaction by routing through OpenSea's
 * `generateFulfillmentData` endpoint (same code path as
 * `/api/marketplace/fulfill`). This is the most reliable per-order path
 * because OpenSea handles all server-side validation (balances, approvals,
 * order status, etc.).
 */
const buildSingleOrderTransaction = async (
  sdk: SDK,
  order: FulfillBatchOrder,
  collectionKey: CollectionKey,
  accountAddress: string,
): Promise<Tx> => {
  const collectionInfo = collections[collectionKey];
  const tokenId = await resolveTokenId(sdk, order.orderHash, order.tokenId);

  const fulfillmentResponse = await sdk.api.generateFulfillmentData(
    accountAddress,
    order.orderHash,
    SEAPORT_ADDRESS,
    OrderSide.LISTING,
    collectionInfo.address,
    tokenId,
  );
  const fulfillmentData = fulfillmentResponse.fulfillment_data;
  if (!fulfillmentData?.transaction) {
    throw new Error(
      `Invalid fulfillment response from OpenSea for order ${order.orderHash}`,
    );
  }
  const txInfo = fulfillmentData.transaction;
  const data = encodeSeaportCall(
    txInfo.function,
    txInfo.input_data as Record<string, unknown>,
  );
  return {
    to: txInfo.to,
    data,
    value: txInfo.value || "0",
  };
};

/**
 * Build atomic batch fulfillment calldata for 2+ orders.
 *
 * Strategy:
 *  1. Call OpenSea's `generateFulfillmentData` for every order. The response
 *     includes `fulfillment_data.orders[0]` — a fully signed
 *     {@link https://github.com/ProjectOpenSea/seaport seaport} order
 *     (`OrderWithCounter` with a non-empty signature). Crucially this is
 *     the canonical way to retrieve a fulfillable signed order; reading via
 *     `getOrderByHash` returns orders that may be missing signatures
 *     (zone-validated orders, etc.), which fails seaport-js's invariant
 *     check.
 *  2. Hand those signed orders to `seaport-js`'s `fulfillOrders`, which
 *     encodes a single atomic `fulfillAvailableAdvancedOrders` call.
 *  3. Build the tx and return its calldata.
 *
 * This produces a single transaction that fulfills every order atomically.
 * Per Seaport semantics, individual orders that are no longer fulfillable
 * (e.g. already sold) are skipped without reverting the whole tx.
 */
const buildAtomicBatchTransaction = async (
  sdk: SDK,
  ordersInput: FulfillBatchOrder[],
  collectionKey: CollectionKey,
  accountAddress: string,
): Promise<Tx> => {
  const collectionInfo = collections[collectionKey];

  const fulfillmentResponses = await Promise.all(
    ordersInput.map(async (o) => {
      const tokenId = await resolveTokenId(sdk, o.orderHash, o.tokenId);
      return sdk.api.generateFulfillmentData(
        accountAddress,
        o.orderHash,
        SEAPORT_ADDRESS,
        OrderSide.LISTING,
        collectionInfo.address,
        tokenId,
      );
    }),
  );

  const signedOrders = fulfillmentResponses.map((res, i) => {
    const orders = res.fulfillment_data?.orders;
    const order = orders?.[0];
    if (!order || !order.signature) {
      throw new Error(
        `Order ${ordersInput[i].orderHash} did not return a signed protocol_data from OpenSea`,
      );
    }
    return order;
  });

  const useCase = await sdk.seaport.fulfillOrders({
    fulfillOrderDetails: signedOrders.map((order) => ({ order })),
    accountAddress,
  });

  const approvalActions = useCase.actions.filter(
    (action) => action.type === "approval",
  );
  if (approvalActions.length > 0) {
    throw new Error(
      "Batch fulfillment requires token approvals which are not supported here. Listings must be priced in ETH.",
    );
  }

  const exchangeAction = useCase.actions.find(
    (action) => action.type === "exchange",
  );
  if (!exchangeAction) {
    throw new Error("Failed to derive a Seaport exchange action");
  }

  const tx = await exchangeAction.transactionMethods.buildTransaction();
  if (!tx.to || !tx.data) {
    throw new Error("Built transaction is missing to or data");
  }
  return {
    to: tx.to,
    data: tx.data,
    value:
      tx.value !== undefined && tx.value !== null ? tx.value.toString() : "0",
  };
};

/**
 * POST /api/marketplace/fulfill-batch
 *
 * Returns a single transaction's calldata for atomically buying one or more
 * OpenSea listings.
 *
 * Body:
 *  - collection: CollectionKey
 *  - orders: Array<{ orderHash: string, tokenId?: string }>
 *  - accountAddress: string (the buyer)
 *
 * Response:
 *  - { transaction: { to, data, value } }
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as FulfillBatchBody;
    const { collection: collectionKey, orders, accountAddress } = body;

    if (!collectionKey || !collections[collectionKey]) {
      return NextResponse.json(
        { error: "Invalid or missing collection" },
        { status: 400 },
      );
    }
    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { error: "orders must be a non-empty array" },
        { status: 400 },
      );
    }
    if (!accountAddress) {
      return NextResponse.json(
        { error: "accountAddress is required" },
        { status: 400 },
      );
    }

    // Construct the SDK with a VoidSigner bound to the buyer. This is what
    // lets seaport-js's `fulfillOrders` build calldata without performing
    // any write-path RPC checks (eth_accounts, balance, approval) against
    // the public/Alchemy node, which would otherwise rate-limit or fail.
    const sdk = getOpenSeaSDK(accountAddress);

    const transaction =
      orders.length === 1
        ? await buildSingleOrderTransaction(
            sdk,
            orders[0],
            collectionKey,
            accountAddress,
          )
        : await buildAtomicBatchTransaction(
            sdk,
            orders,
            collectionKey,
            accountAddress,
          );

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error in /api/marketplace/fulfill-batch", error);
    return NextResponse.json(
      {
        error: `Failed to build batch fulfillment data: ${details}`,
        details,
      },
      { status: 500 },
    );
  }
};
