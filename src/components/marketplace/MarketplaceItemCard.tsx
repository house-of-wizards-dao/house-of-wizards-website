"use client";

import { NFTCard, NFTCardSkeleton } from "@/components/ui/NFTCard";
import type { MarketplaceItem } from "@/types/marketplace";
import { formatEthFromWei } from "@/types/marketplace";

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onClick?: (item: MarketplaceItem) => void;
  onBuy?: (item: MarketplaceItem) => void;
  selected?: boolean;
  isBuyLoading?: boolean;
}

export function MarketplaceItemCard({
  item,
  onClick,
  onBuy,
  selected = false,
  isBuyLoading = false,
}: MarketplaceItemCardProps) {
  const { nft, bestListing } = item;

  // Format the listing price
  const listingPrice = bestListing
    ? formatEthFromWei(bestListing.price.amount)
    : undefined;

  return (
    <NFTCard
      tokenId={nft.identifier}
      name={nft.name || `${item.collection.name} #${nft.identifier}`}
      imageUrl={nft.image_url}
      onClick={() => onClick?.(item)}
      selected={selected}
      price={listingPrice}
      priceCurrency="ETH"
      onBuy={onBuy ? () => onBuy(item) : undefined}
      isBuyLoading={isBuyLoading}
    />
  );
}

/**
 * Re-export skeleton from shared component
 */
export { NFTCardSkeleton as MarketplaceItemSkeleton };
