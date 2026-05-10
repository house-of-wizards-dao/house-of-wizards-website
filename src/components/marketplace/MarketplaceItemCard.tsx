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
  /** True if the NFTX listing for this item is currently in the cart */
  inCart?: boolean;
  /** Click handler for the + button (add to cart). Receives the item. */
  onAddToCart?: (item: MarketplaceItem) => void;
  /** Click handler for the - button (remove from cart). Receives the item. */
  onRemoveFromCart?: (item: MarketplaceItem) => void;
  /**
   * When provided and the item is NOT in the cart, overrides the displayed
   * NFTX listing price with the live marginal "next-buy" price. Used so
   * unselected NFTX cards reflect the cost of adding one more NFT to the
   * current batch as the cart grows.
   */
  marginalNftxPriceEth?: string;
  /**
   * When provided and the item IS in the cart (NFTX), overrides the
   * displayed price with the shared per-item cost of the current batch
   * (i.e. `totalEth / count`). All in-cart NFTX cards display the same
   * value so the price reflects the actual atomic-batch economics.
   */
  nftxBatchPerItemPriceEth?: string;
  /** Override displayed ETH price, used by sell mode for best offers. */
  priceEthOverride?: string;
  priceCurrencyOverride?: string;
  priceLabelOverride?: string;
  actionLabel?: string;
  hoverActionLabel?: string;
  actionLoadingLabel?: string;
};

const formatCompactEth = (price: string | undefined) => {
  if (!price) return price;
  const value = Number(price);
  if (!Number.isFinite(value)) return price;
  return value.toFixed(value < 1 ? 3 : 2);
};

const formatEthForDisplay = (eth: string): string => {
  const value = parseFloat(eth);
  return value.toFixed(value < 1 ? 4 : 3);
};

/** Matches grid card price + source (OpenSea wins when both exist, same as the card body). */
export type MarketplaceItemBuyPresentation = {
  listingPrice: string | undefined;
  priceSource: "opensea" | "nftx" | undefined;
};

export const getMarketplaceItemBuyPresentation = (
  item: MarketplaceItem,
  options?: {
    inCart?: boolean;
    marginalNftxPriceEth?: string;
    nftxBatchPerItemPriceEth?: string;
    priceEthOverride?: string;
  },
): MarketplaceItemBuyPresentation => {
  const {
    inCart = false,
    marginalNftxPriceEth,
    nftxBatchPerItemPriceEth,
    priceEthOverride,
  } = options || {};
  const { bestListing, nftxListing } = item;

  let listingPrice: string | undefined;
  let priceSource: "opensea" | "nftx" | undefined;

  if (priceEthOverride) {
    listingPrice = formatEthForDisplay(priceEthOverride);
    priceSource = undefined;
  } else if (bestListing) {
    listingPrice = formatEthFromWei(bestListing.price.amount);
    priceSource = "opensea";
  } else if (nftxListing) {
    if (inCart && nftxBatchPerItemPriceEth) {
      listingPrice = formatEthForDisplay(nftxBatchPerItemPriceEth);
    } else if (!inCart && marginalNftxPriceEth) {
      listingPrice = formatEthForDisplay(marginalNftxPriceEth);
    } else {
      listingPrice = formatEthForDisplay(nftxListing.priceEth);
    }
    priceSource = "nftx";
  }

  return { listingPrice, priceSource };
};

export const MarketplaceItemCard = ({
  item,
  onClick,
  onBuy,
  selected = false,
  isBuyLoading = false,
  size = "default",
  inCart = false,
  onAddToCart,
  onRemoveFromCart,
  marginalNftxPriceEth,
  nftxBatchPerItemPriceEth,
  priceEthOverride,
  priceCurrencyOverride,
  priceLabelOverride,
  actionLabel,
  hoverActionLabel,
  actionLoadingLabel,
}: MarketplaceItemCardProps) => {
  const { nft } = item;

  const { listingPrice: rawListingPrice, priceSource } =
    getMarketplaceItemBuyPresentation(item, {
      inCart,
      marginalNftxPriceEth,
      nftxBatchPerItemPriceEth,
      priceEthOverride,
    });

  let listingPrice = rawListingPrice;

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
      priceCurrency={priceCurrencyOverride || "ETH"}
      priceLabel={
        priceLabelOverride || (priceSource === "nftx" ? "NFTX" : undefined)
      }
      onBuy={onBuy ? () => onBuy(item) : undefined}
      isBuyLoading={isBuyLoading}
      actionLabel={actionLabel}
      hoverActionLabel={hoverActionLabel}
      actionLoadingLabel={actionLoadingLabel}
      size={size}
      inCart={inCart}
      onAddToCart={onAddToCart ? () => onAddToCart(item) : undefined}
      onRemoveFromCart={
        onRemoveFromCart ? () => onRemoveFromCart(item) : undefined
      }
    />
  );
};

/**
 * Re-export skeleton from shared component
 */
export { NFTCardSkeleton as MarketplaceItemSkeleton };
