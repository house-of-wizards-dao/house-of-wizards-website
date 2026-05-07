/**
 * Marketplace shopping cart types
 *
 * The cart is locked to a single collection at a time, but can mix items
 * from OpenSea and the NFTX pool within that collection.
 */

import type { CollectionKey } from "./marketplace";

export type CartItemSource = "opensea" | "nftx";

/**
 * A single item in the marketplace cart.
 *
 * Snapshot prices are captured at the moment of addition so the sidebar can
 * keep showing a stable per-item price even when the live NFTX quote moves.
 * The authoritative total for NFTX checkout is recomputed server-side at
 * checkout time via a fresh batch quote.
 */
export type CartItem = {
  source: CartItemSource;
  collectionKey: CollectionKey;
  tokenId: string;
  name: string;
  imageUrl?: string;
  /** Snapshot price in wei at the time the item was added to the cart */
  snapshotPriceWei: string;
  /** Snapshot price in ETH at the time the item was added to the cart */
  snapshotPriceEth: string;
  /** OpenSea order hash, required for OpenSea source */
  orderHash?: string;
  /** NFTX vault address, kept for reference (NFTX source) */
  vaultAddress?: string;
};

export type CartState = {
  collectionKey: CollectionKey | null;
  items: CartItem[];
  isOpen: boolean;
};

/**
 * Stable identity used to compare cart items
 */
export const cartItemKey = (item: Pick<CartItem, "source" | "tokenId">) =>
  `${item.source}:${item.tokenId}`;
