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
  size?: "default" | "compact";
  /** When true, the card shows a "selected for cart" highlight */
  inCart?: boolean;
  /** Click handler for the + (add to cart) button */
  onAddToCart?: (e: React.MouseEvent) => void;
  /** Click handler for the - (remove from cart) button */
  onRemoveFromCart?: (e: React.MouseEvent) => void;
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
  size = "default",
  inCart = false,
  onAddToCart,
  onRemoveFromCart,
}: NFTCardProps) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = imageUrl && !imageError;
  const isCompact = size === "compact";
  const showCartToggle = !!onAddToCart || !!onRemoveFromCart;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy?.(e);
  };

  const handleCartToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inCart) {
      onRemoveFromCart?.(e);
    } else {
      onAddToCart?.(e);
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-800 bg-[#0C0B10] overflow-hidden transition-all hover:border-gray-600 hover:shadow-lg text-left",
        selected && "border-brand-500 ring-2 ring-brand-500/50",
        inCart &&
          "border-emerald-500 ring-2 ring-emerald-500/60 shadow-emerald-500/20",
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
        {/* Cart toggle button (top-left) */}
        {showCartToggle && (
          <button
            type="button"
            onClick={handleCartToggle}
            aria-label={inCart ? "Remove from cart" : "Add to cart"}
            title={inCart ? "Remove from cart" : "Add to cart"}
            className={cn(
              "absolute z-10 flex items-center justify-center rounded-full shadow-md transition-all",
              isCompact ? "top-1.5 left-1.5 w-6 h-6" : "top-2 left-2 w-8 h-8",
              inCart
                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                : "bg-black/70 text-white hover:bg-black/90 border border-white/30",
            )}
          >
            {inCart ? (
              <MinusIcon className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
            ) : (
              <PlusIcon className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
            )}
          </button>
        )}
        {/* "In cart" chip (corner badge under cart toggle for clarity) */}
        {inCart && !isCompact && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500 text-white">
            In cart
          </div>
        )}
        {/* Source badge */}
        {priceLabel && (
          <div
            className={cn(
              "absolute font-bold rounded bg-pink-600 text-white",
              isCompact
                ? "top-1.5 right-1.5 px-1.5 py-0.5 text-[10px]"
                : "top-2 right-2 px-2 py-0.5 text-xs",
            )}
          >
            {priceLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div className={cn(isCompact ? "p-2" : "p-3")}>
        {/* Token ID and Name on same line */}
        <div
          className={cn(
            "text-white truncate",
            isCompact ? "text-xs" : "text-sm",
          )}
          title={`#${tokenId} ${name}`}
        >
          #{tokenId} {name}
        </div>

        {/* Price and Buy button */}
        {price && (
          <div className={cn(isCompact ? "mt-1.5" : "mt-2")}>
            {onBuy ? (
              <button
                onClick={handleBuyClick}
                disabled={isBuyLoading || disabled}
                className={cn(
                  "w-full font-bold rounded-lg transition-all whitespace-nowrap",
                  isCompact ? "px-2 py-1.5 text-xs" : "px-4 py-2 text-sm",
                  "bg-brand-700 hover:bg-brand-600 text-white",
                  "shadow-lg shadow-brand-700/25 hover:shadow-brand-600/40",
                  (isBuyLoading || disabled) &&
                    "opacity-50 cursor-not-allowed shadow-none",
                )}
              >
                {isBuyLoading
                  ? "Buying..."
                  : isCompact
                    ? `${price} ${priceCurrency}`
                    : `Buy for ${price} ${priceCurrency}`}
              </button>
            ) : (
              <div
                className={cn(
                  "font-semibold text-white",
                  isCompact ? "text-xs" : "text-sm",
                )}
              >
                {price} {priceCurrency}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden
  >
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden
  >
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

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
