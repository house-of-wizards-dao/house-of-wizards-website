"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn, formatTimeRemaining } from "@/lib/utils";
import { marketplaceConfig } from "@/lib/marketplace";
import type { MarketplaceItem, Offer } from "@/types/marketplace";
import { formatEthFromWei } from "@/types/marketplace";
import { useMarketplaceActions, useNFTOwnership } from "@/hooks/useMarketplace";

type ItemDetailOverlayProps = {
  item: MarketplaceItem;
  isOpen: boolean;
  onClose: () => void;
  onActionComplete?: () => void;
};

export const ItemDetailOverlay = ({
  item,
  isOpen,
  onClose,
  onActionComplete,
}: ItemDetailOverlayProps) => {
  const { isConnected, address } = useAccount();
  const { isOwner } = useNFTOwnership(item.collection.key, item.nft.identifier);
  const { buyNFT, acceptOffer, isProcessing, error } = useMarketplaceActions();
  const [activeTab, setActiveTab] = useState<"details" | "offers">("details");
  const [actionResult, setActionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const { nft, collection, listings, offers, bestListing, bestOffer } = item;

  const handleBuy = async () => {
    if (!bestListing) return;

    setActionResult(null);
    const result = await buyNFT(collection.key, nft.identifier, bestListing);

    if (result.success) {
      setActionResult({
        success: true,
        message: `Purchase successful! Transaction: ${result.txHash?.slice(0, 10)}...`,
      });
      onActionComplete?.();
    } else {
      setActionResult({
        success: false,
        message: result.error || "Purchase failed",
      });
    }
  };

  const handleAcceptOffer = async (offer: Offer) => {
    setActionResult(null);
    const result = await acceptOffer(collection.key, nft.identifier, offer);

    if (result.success) {
      setActionResult({
        success: true,
        message: `Offer accepted! Transaction: ${result.txHash?.slice(0, 10)}...`,
      });
      onActionComplete?.();
    } else {
      setActionResult({
        success: false,
        message: result.error || "Failed to accept offer",
      });
    }
  };

  const handleListOnOpenSea = () => {
    // Open OpenSea listing page
    window.open(
      `https://opensea.io/assets/ethereum/${collection.address}/${nft.identifier}/sell`,
      "_blank",
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0C0B10] border border-gray-800 rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">
            {nft.name || `${collection.name} #${nft.identifier}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                {nft.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={nft.image_url}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-gray-600">
                      #{nft.identifier}
                    </span>
                  </div>
                )}
              </div>

              {/* OpenSea Link */}
              <a
                href={nft.opensea_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white"
              >
                View on OpenSea
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                <button
                  className={cn(
                    "px-4 py-2 font-medium",
                    activeTab === "details"
                      ? "text-white border-b-2 border-violet-500"
                      : "text-gray-400 hover:text-white",
                  )}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                {marketplaceConfig.offersEnabled && (
                  <button
                    className={cn(
                      "px-4 py-2 font-medium",
                      activeTab === "offers"
                        ? "text-white border-b-2 border-violet-500"
                        : "text-gray-400 hover:text-white",
                    )}
                    onClick={() => setActiveTab("offers")}
                  >
                    Offers ({offers.length})
                  </button>
                )}
              </div>

              {activeTab === "details" && (
                <div className="space-y-4">
                  {/* Collection */}
                  <div>
                    <span className="text-gray-400 text-sm">Collection</span>
                    <p className="text-white">{collection.name}</p>
                  </div>

                  {/* Token ID */}
                  <div>
                    <span className="text-gray-400 text-sm">Token ID</span>
                    <p className="text-white">#{nft.identifier}</p>
                  </div>

                  {/* Description */}
                  {nft.description && (
                    <div>
                      <span className="text-gray-400 text-sm">Description</span>
                      <p className="text-white text-sm">{nft.description}</p>
                    </div>
                  )}

                  {/* Traits */}
                  {nft.traits && nft.traits.length > 0 && (
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">
                        Traits
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {nft.traits.map((trait, i) => (
                          <div
                            key={i}
                            className="bg-gray-800/50 rounded-lg px-3 py-2"
                          >
                            <span className="text-gray-400 text-xs block">
                              {trait.trait_type}
                            </span>
                            <span className="text-white text-sm">
                              {String(trait.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Current Listing */}
                  {bestListing && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <span className="text-gray-400 text-sm">
                        Current Price
                      </span>
                      <p className="text-2xl font-bold text-white">
                        {formatEthFromWei(bestListing.price.amount)} ETH
                      </p>
                    </div>
                  )}

                  {/* Best Offer */}
                  {marketplaceConfig.offersEnabled && bestOffer && (
                    <div className="bg-violet-900/30 rounded-lg p-4">
                      <span className="text-gray-400 text-sm">Best Offer</span>
                      <p className="text-xl font-semibold text-violet-300">
                        {formatEthFromWei(bestOffer.price.amount)}{" "}
                        {bestOffer.price.currency}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "offers" && (
                <div className="space-y-3">
                  {offers.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No offers yet
                    </p>
                  ) : (
                    offers.map((offer, i) => (
                      <OfferRow
                        key={offer.orderHash || i}
                        offer={offer}
                        isOwner={isOwner}
                        onAccept={() => handleAcceptOffer(offer)}
                        isProcessing={isProcessing}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-3">
          {/* Error/Success Messages */}
          {(error || actionResult) && (
            <div
              className={cn(
                "px-4 py-2 rounded-lg text-sm",
                actionResult?.success
                  ? "bg-green-900/50 text-green-300"
                  : "bg-red-900/50 text-red-300",
              )}
            >
              {actionResult?.message || error}
            </div>
          )}

          {!isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : (
            <div className="flex gap-3">
              {/* Buy Button - for non-owners when listed */}
              {!isOwner && bestListing && (
                <button
                  onClick={handleBuy}
                  disabled={isProcessing}
                  className={cn(
                    "flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors",
                    isProcessing && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Buy for ${formatEthFromWei(bestListing.price.amount)} ETH`}
                </button>
              )}

              {/* List Button - for owners */}
              {isOwner && (
                <button
                  onClick={handleListOnOpenSea}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  List on OpenSea
                </button>
              )}

              {/* Accept Best Offer Button - for owners with offers */}
              {marketplaceConfig.offersEnabled && isOwner && bestOffer && (
                <button
                  onClick={() => handleAcceptOffer(bestOffer)}
                  disabled={isProcessing}
                  className={cn(
                    "flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors",
                    isProcessing && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Accept Best Offer (${formatEthFromWei(bestOffer.price.amount)} ${bestOffer.price.currency})`}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Individual offer row component
 */
const OfferRow = ({
  offer,
  isOwner,
  onAccept,
  isProcessing,
}: {
  offer: Offer;
  isOwner: boolean;
  onAccept: () => void;
  isProcessing: boolean;
}) => {
  const price = formatEthFromWei(offer.price.amount);
  const timeRemaining = formatTimeRemaining(offer.expirationTime);
  const isExpired = timeRemaining === "Ended";

  // Don't render expired offers at all (they should be filtered server-side, but just in case)
  if (isExpired) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3",
        offer.isCollectionOffer && "border border-violet-500/30",
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="text-white font-medium">
            {price} {offer.price.currency}
          </p>
          {offer.isCollectionOffer && (
            <span className="text-xs bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded">
              Collection Offer
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs">
          From:{" "}
          {offer.maker
            ? `${offer.maker.slice(0, 6)}...${offer.maker.slice(-4)}`
            : "Unknown"}
        </p>
        <p className="text-gray-500 text-xs">Expires in {timeRemaining}</p>
      </div>

      {isOwner && (
        <button
          onClick={onAccept}
          disabled={isProcessing}
          className={cn(
            "bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors",
            isProcessing && "opacity-50 cursor-not-allowed",
          )}
        >
          Accept
        </button>
      )}
    </div>
  );
};
