"use client";

import { useMemo } from "react";
import { useCartContext } from "@/contexts/CartContext";
import type { CartItem } from "@/types/cart";

/**
 * Convenience selectors over the cart context.
 *
 * Splits the cart by source (OpenSea / NFTX) and computes the OpenSea subtotal
 * (which is just a sum of static listing prices). The NFTX total must be
 * fetched live via {@link useNFTXBatchQuote} since it depends on slippage.
 */
export const useCart = () => {
  const ctx = useCartContext();
  const { state } = ctx;

  const openSeaItems = useMemo<CartItem[]>(
    () => state.items.filter((item) => item.source === "opensea"),
    [state.items],
  );

  const nftxItems = useMemo<CartItem[]>(
    () => state.items.filter((item) => item.source === "nftx"),
    [state.items],
  );

  const openSeaTotalWei = useMemo(() => {
    return openSeaItems.reduce<bigint>((acc, item) => {
      try {
        return acc + BigInt(item.snapshotPriceWei || "0");
      } catch {
        return acc;
      }
    }, 0n);
  }, [openSeaItems]);

  const nftxSnapshotTotalWei = useMemo(() => {
    return nftxItems.reduce<bigint>((acc, item) => {
      try {
        return acc + BigInt(item.snapshotPriceWei || "0");
      } catch {
        return acc;
      }
    }, 0n);
  }, [nftxItems]);

  return {
    ...ctx,
    items: state.items,
    collectionKey: state.collectionKey,
    isOpen: state.isOpen,
    openSeaItems,
    nftxItems,
    openSeaCount: openSeaItems.length,
    nftxCount: nftxItems.length,
    openSeaTotalWei,
    nftxSnapshotTotalWei,
  };
};
