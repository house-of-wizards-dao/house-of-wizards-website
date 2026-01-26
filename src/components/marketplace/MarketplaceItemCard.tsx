"use client";

import { NFTCard, NFTCardSkeleton } from "@/components/ui/NFTCard";
import type { MarketplaceItem } from "@/types/marketplace";
import { formatEthFromWei } from "@/types/marketplace";

type MarketplaceItemCardProps = {
  item: MarketplaceItem;
  onClick?: (item: MarketplaceItem) => void;
  onBuy?: (item: MarketplaceItem) => void;
  selected?: boolean;
  isBuyLoading?: boolean;
};

export const MarketplaceItemCard = ({
  item,
  onClick,
  onBuy,
  selected = false,
  isBuyLoading = false,
}: MarketplaceItemCardProps) => {
  const { nft, bestListing, nftxListing } = item;

  // Format the listing price - prioritize OpenSea listing, fall back to NFTX
  let listingPrice: string | undefined;
  let priceSource: "opensea" | "nftx" | undefined;

  if (bestListing) {
    listingPrice = formatEthFromWei(bestListing.price.amount);
    priceSource = "opensea";
  } else if (nftxListing) {
    listingPrice = nftxListing.priceEth;
    priceSource = "nftx";
  }

  return (
    <NFTCard
      tokenId={nft.identifier}
      name={nft.name || `${item.collection.name} #${nft.identifier}`}
      imageUrl={nft.image_url}
      onClick={() => onClick?.(item)}
      selected={selected}
      price={listingPrice}
      priceCurrency="ETH"
      priceLabel={priceSource === "nftx" ? "NFTX" : undefined}
      onBuy={onBuy ? () => onBuy(item) : undefined}
      isBuyLoading={isBuyLoading}
    />
  );
};

/**
 * Re-export skeleton from shared component
 */
export { NFTCardSkeleton as MarketplaceItemSkeleton };
