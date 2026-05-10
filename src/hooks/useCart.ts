"use client";

import { useMemo } from "react";
import { useCartContext } from "@/contexts/CartContext";
import type { BuyCartItem, SellCartItem } from "@/types/cart";

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

  const openSeaItems = useMemo<BuyCartItem[]>(
    () =>
      state.items.filter(
        (item): item is BuyCartItem => item.source === "opensea",
      ),
    [state.items],
  );

  const nftxItems = useMemo<BuyCartItem[]>(
    () =>
      state.items.filter((item): item is BuyCartItem => item.source === "nftx"),
    [state.items],
  );

  const sellItems = useMemo<SellCartItem[]>(
    () =>
      state.items.filter(
        (item): item is SellCartItem => item.source === "sell",
      ),
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
    sellItems,
    openSeaCount: openSeaItems.length,
    nftxCount: nftxItems.length,
    sellCount: sellItems.length,
    openSeaTotalWei,
    nftxSnapshotTotalWei,
  };
};
