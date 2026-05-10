"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn, formatTimeRemaining } from "@/lib/utils";
import { marketplaceConfig } from "@/lib/marketplace";
import type { MarketplaceItem, Offer } from "@/types/marketplace";
import { formatEthFromWei } from "@/types/marketplace";
import { useMarketplaceActions, useNFTOwnership } from "@/hooks/useMarketplace";
import {
  asLocalNftCollection,
  getLocalNftAffinity,
  getLocalNftTraits,
  type LocalNftAffinity,
  type LocalNftTrait,
} from "@/data/localNftPreview";

/** Unified buy (OpenSea + NFTX) from marketplace browser — matches grid `handleBuy` and card price. */
export type ItemDetailMarketplaceBuy = {
  onBuy: () => void | Promise<void>;
  priceEth: string;
  priceSource: "opensea" | "nftx";
  isLoading: boolean;
};

type ItemDetailOverlayProps = {
  item: MarketplaceItem;
  isOpen: boolean;
  onClose: () => void;
  onActionComplete?: () => void;
  marketplaceBuy?: ItemDetailMarketplaceBuy;
};

export const ItemDetailOverlay = ({
  item,
  isOpen,
  onClose,
  onActionComplete,
  marketplaceBuy,
}: ItemDetailOverlayProps) => {
  const { isConnected } = useAccount();
  const { isOwner } = useNFTOwnership(item.nft.owner);
  const { buyNFT, acceptOffer, isProcessing, error } = useMarketplaceActions();
  const [activeTab, setActiveTab] = useState<"details" | "offers">("details");
  const [actionResult, setActionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const localCollection = asLocalNftCollection(item.collection.key);

  // For NFTX listings of wizards/warriors, derive traits + affinity from
  // local trait/affinity maps since the NFTX subgraph and pool do not
  // surface that metadata themselves.
  const isNftxPreview = !!item.nftxListing && !!localCollection;

  const localTraits = useMemo<LocalNftTrait[]>(() => {
    if (!isNftxPreview || !localCollection) return [];
    return getLocalNftTraits(localCollection, item.nft.identifier);
  }, [isNftxPreview, localCollection, item.nft.identifier]);

  const localAffinity = useMemo<LocalNftAffinity | null>(() => {
    if (!isNftxPreview || !localCollection) return null;
    return getLocalNftAffinity(localCollection, item.nft.identifier);
  }, [isNftxPreview, localCollection, item.nft.identifier]);

  if (!isOpen) return null;

  const { nft, collection, offers, bestListing, bestOffer } = item;

  const handleBuyOpenSeaOnly = async () => {
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

  const handleMarketplaceBuy = async () => {
    if (!marketplaceBuy) return;
    setActionResult(null);
    await marketplaceBuy.onBuy();
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
                  {isNftxPreview && localTraits.length > 0 ? (
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">
                        Traits
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {localTraits.map((trait) => (
                          <div
                            key={`${trait.part}-${trait.displayName}`}
                            className="bg-gray-800/50 rounded-lg px-3 py-2"
                            title={trait.description}
                          >
                            <span className="text-gray-400 text-xs block">
                              {trait.part}
                            </span>
                            <span className="text-white text-sm">
                              {trait.displayName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    nft.traits &&
                    nft.traits.length > 0 && (
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
                    )
                  )}

                  {/* Affinity (NFTX wizards/warriors only — derived from
                      local affinity data) */}
                  {isNftxPreview && localAffinity && (
                    <div>
                      <span className="text-gray-400 text-sm block mb-2">
                        Affinity
                      </span>
                      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                        <h3 className="text-base font-semibold text-white">
                          {localAffinity.affinityName}
                        </h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="flex items-center justify-between gap-3">
                            <span className="text-gray-400">Attunement</span>
                            <span className="font-medium text-gray-200">
                              {localAffinity.attunement}%
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-3">
                            <span className="text-gray-400">Traits</span>
                            <span className="font-medium text-gray-200">
                              {localAffinity.traitsInAffinity}/
                              {localAffinity.numberOfTraits}
                            </span>
                          </p>
                        </div>
                        {localAffinity.isMaxAffinity && (
                          <p className="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-xs font-medium text-amber-100">
                            Max affinity{" "}
                            {localAffinity.collectionLabel.slice(0, -1)}:{" "}
                            {localAffinity.maxTraitCount}/
                            {localAffinity.maxTraitCount} traits and 100%
                            attuned.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Current listing price (same source + formatting as grid card) */}
                  {(marketplaceBuy || bestListing) && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-400 text-sm">
                          Current Price
                        </span>
                        {marketplaceBuy?.priceSource === "nftx" && (
                          <span className="rounded bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            NFTX
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {marketplaceBuy
                          ? `${marketplaceBuy.priceEth} ETH`
                          : `${formatEthFromWei(bestListing!.price.amount)} ETH`}
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
              {/* Buy — unified path (OpenSea + NFTX) when parent provides marketplaceBuy */}
              {!isOwner && marketplaceBuy && (
                <button
                  type="button"
                  onClick={() => void handleMarketplaceBuy()}
                  disabled={marketplaceBuy.isLoading || isProcessing}
                  className={cn(
                    "flex-1 rounded-lg bg-brand-700 py-3 px-6 font-bold text-white shadow-lg shadow-brand-700/25 transition-colors hover:bg-brand-600 hover:shadow-brand-600/40",
                    (marketplaceBuy.isLoading || isProcessing) &&
                      "cursor-not-allowed opacity-50 shadow-none",
                  )}
                >
                  {marketplaceBuy.isLoading || isProcessing
                    ? "Buying..."
                    : `Buy for ${marketplaceBuy.priceEth} ETH`}
                </button>
              )}

              {/* Fallback: OpenSea-only when overlay is used without marketplaceBuy */}
              {!isOwner && !marketplaceBuy && bestListing && (
                <button
                  type="button"
                  onClick={() => void handleBuyOpenSeaOnly()}
                  disabled={isProcessing}
                  className={cn(
                    "flex-1 rounded-lg bg-brand-700 py-3 px-6 font-bold text-white shadow-lg shadow-brand-700/25 transition-colors hover:bg-brand-600 hover:shadow-brand-600/40",
                    isProcessing && "cursor-not-allowed opacity-50 shadow-none",
                  )}
                >
                  {isProcessing
                    ? "Buying..."
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
                  type="button"
                  onClick={() => handleAcceptOffer(bestOffer)}
                  disabled={isProcessing}
                  aria-label={`Accept best offer, ${formatEthFromWei(bestOffer.price.amount)} ${bestOffer.price.currency}`}
                  className={cn(
                    "group grid flex-1 place-content-center rounded-lg bg-violet-600 py-3 px-6 font-semibold text-white transition-colors hover:bg-violet-500",
                    isProcessing && "cursor-not-allowed opacity-50",
                  )}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <span className="col-start-1 row-start-1 w-full text-center transition-opacity duration-150 group-hover:invisible group-focus-visible:invisible group-hover:opacity-0 group-focus-visible:opacity-0">
                        {`${formatEthFromWei(bestOffer.price.amount)} ${bestOffer.price.currency}`}
                      </span>
                      <span
                        className="col-start-1 row-start-1 z-[1] w-full text-center opacity-0 invisible transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
                        aria-hidden
                      >
                        Accept
                      </span>
                    </>
                  )}
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
    <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-white font-medium">
            {price} {offer.price.currency}
          </p>
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
          type="button"
          onClick={onAccept}
          disabled={isProcessing}
          aria-label={`Accept offer, ${price} ${offer.price.currency}`}
          className={cn(
            "group grid min-w-[5.5rem] place-content-center rounded-lg bg-violet-600 py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-500",
            isProcessing && "cursor-not-allowed opacity-50",
          )}
        >
          {isProcessing ? (
            `${price} ${offer.price.currency}`
          ) : (
            <>
              <span className="col-start-1 row-start-1 w-full text-center transition-opacity duration-150 group-hover:invisible group-focus-visible:invisible group-hover:opacity-0 group-focus-visible:opacity-0">
                {`${price} ${offer.price.currency}`}
              </span>
              <span
                className="col-start-1 row-start-1 z-[1] w-full text-center opacity-0 invisible transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100"
                aria-hidden
              >
                Accept
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
