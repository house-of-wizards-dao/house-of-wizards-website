"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type NFTCardProps = {
  tokenId: string | number;
  name: string;
  imageUrl?: string;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  // Marketplace-specific props
  price?: string;
  priceCurrency?: string;
  /** Label to show source (e.g., "NFTX") */
  priceLabel?: string;
  onBuy?: (e: React.MouseEvent) => void;
  isBuyLoading?: boolean;
};

/**
 * Shared NFT card component used by both Browser and MarketplaceBrowser
 */
export const NFTCard = ({
  tokenId,
  name,
  imageUrl,
  onClick,
  selected = false,
  disabled = false,
  price,
  priceCurrency = "ETH",
  priceLabel,
  onBuy,
  isBuyLoading = false,
}: NFTCardProps) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = imageUrl && !imageError;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy?.(e);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-800 bg-[#0C0B10] overflow-hidden transition-all hover:border-gray-600 hover:shadow-lg text-left",
        selected && "border-brand-500 ring-2 ring-brand-500/50",
        disabled && "opacity-50 cursor-not-allowed",
        onClick && !disabled && "cursor-pointer",
      )}
      onClick={() => !disabled && onClick?.()}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
        {hasImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={name || `#${tokenId}`}
            className={cn(
              "w-full h-full object-cover",
              disabled && "opacity-50",
            )}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-600">#{tokenId}</span>
          </div>
        )}
        {/* Source badge */}
        {priceLabel && (
          <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded bg-pink-600 text-white">
            {priceLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Token ID and Name on same line */}
        <div
          className="text-white text-sm truncate"
          title={`#${tokenId} ${name}`}
        >
          #{tokenId} {name}
        </div>

        {/* Price and Buy button */}
        {price && (
          <div className="mt-2">
            {onBuy ? (
              <button
                onClick={handleBuyClick}
                disabled={isBuyLoading || disabled}
                className={cn(
                  "w-full px-4 py-2 text-sm font-bold rounded-lg transition-all",
                  "bg-brand-700 hover:bg-brand-600 text-white",
                  "shadow-lg shadow-brand-700/25 hover:shadow-brand-600/40",
                  (isBuyLoading || disabled) &&
                    "opacity-50 cursor-not-allowed shadow-none",
                )}
              >
                {isBuyLoading
                  ? "Buying..."
                  : `Buy for ${price} ${priceCurrency}`}
              </button>
            ) : (
              <div className="text-sm font-semibold text-white">
                {price} {priceCurrency}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Loading skeleton for NFT cards
 */
export const NFTCardSkeleton = () => {
  return (
    <div className="rounded-lg border border-gray-800 bg-[#0C0B10] overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
};
