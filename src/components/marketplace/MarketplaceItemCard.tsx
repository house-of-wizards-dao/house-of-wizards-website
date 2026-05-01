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
  size?: "default" | "compact";
};

const formatCompactEth = (price: string | undefined) => {
  if (!price) return price;
  const value = Number(price);
  if (!Number.isFinite(value)) return price;
  return value.toFixed(value < 1 ? 3 : 2);
};

export const MarketplaceItemCard = ({
  item,
  onClick,
  onBuy,
  selected = false,
  isBuyLoading = false,
  size = "default",
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

  if (size === "compact") {
    listingPrice = formatCompactEth(listingPrice);
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
      size={size}
    />
  );
};

/**
 * Re-export skeleton from shared component
 */
export { NFTCardSkeleton as MarketplaceItemSkeleton };
