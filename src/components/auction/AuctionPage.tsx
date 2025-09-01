import React, { useState } from "react";
import { formatEther } from "viem";
import { Chip } from "@nextui-org/chip";
import { useAccount } from "wagmi";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuctionData } from "@/hooks/useAuctionData";
import { AuctionPageProps, Bid, AuctionActivity } from "@/types";
import { useToast } from "@/hooks/useToast";
import { ArtworkZoom } from "./ArtworkZoom";
import { AuctionTimer } from "./AuctionTimer";
import { BiddingInterface } from "./BiddingInterface";
import { BidHistoryWithData } from "./BidHistoryWithData";
import { ActivityFeed } from "./ActivityFeed";
import { ArtistProfile } from "./ArtistProfile";

export function AuctionPage({
  auction: initialAuction,
  initialBids,
  initialActivity,
}: AuctionPageProps) {
  const { address } = useAccount();
  const { isMobile, isTablet } = useResponsive();
  const {
    success: showSuccess,
    error: showError,
    warning: showWarning,
  } = useToast();

  const {
    auction,
    bids,
    activity,
    isLoading,
    error,
    userBids,
    isUserWinning,
    nextMinBid,
    refresh,
    addBid,
    addActivity,
  } = useAuctionData(initialAuction.id, {
    auction: initialAuction,
    bids: initialBids,
    activity: initialActivity,
  });

  const [activeTab, setActiveTab] = useState<"bids" | "activity">("bids");

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Error Loading Auction
          </h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 aspect-square rounded-lg mb-4"></div>
              <div className="bg-gray-800 h-8 rounded mb-2"></div>
              <div className="bg-gray-800 h-6 rounded w-3/4"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800 h-48 rounded-lg"></div>
              <div className="bg-gray-800 h-64 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleBidPlaced = async (
    bidAmountWei: string,
    transactionHash: string,
  ) => {
    if (!address) return;

    // Create optimistic bid
    const newBid: Bid = {
      id: `temp-${Date.now()}`,
      auction_id: auction.id,
      bidder_address: address,
      amount: bidAmountWei,
      transaction_hash: transactionHash,
      created_at: new Date().toISOString(),
      is_winning: true,
    };

    // Create activity entry
    const newActivity: AuctionActivity = {
      id: `temp-activity-${Date.now()}`,
      auction_id: auction.id,
      type: "bid",
      user_address: address,
      amount: bidAmountWei,
      transaction_hash: transactionHash,
      created_at: new Date().toISOString(),
    };

    // Optimistically update UI
    addBid(newBid);
    addActivity(newActivity);

    // In production, you would also call an API to record the bid
    try {
      await fetch(`/api/auctions/${auction.id}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bidder_address: address,
          amount: bidAmountWei,
          transaction_hash: transactionHash,
        }),
      });
    } catch (error) {
      console.error("Failed to record bid:", error);
      showWarning(
        "Your bid was placed but may not appear immediately",
        "Warning",
      );
    }
  };

  const currentBidEth = formatEther(BigInt(auction.current_bid ?? 0));
  const startPriceEth = formatEther(BigInt(auction.start_price ?? 0));

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {auction.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Chip
                color={
                  auction.status === "active"
                    ? "success"
                    : auction.status === "ended"
                      ? "default"
                      : auction.status === "draft"
                        ? "warning"
                        : "danger"
                }
                variant="flat"
                size="lg"
              >
                {auction.status.charAt(0).toUpperCase() +
                  auction.status.slice(1)}
              </Chip>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{bids.length} bids</span>
            </div>
          </div>

          {/* Current Price */}
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Bid</p>
            <p className="text-2xl md:text-3xl font-bold text-white">
              {currentBidEth} ETH
            </p>
            {auction.start_price !== auction.current_bid && (
              <p className="text-sm text-gray-400">
                Started at {startPriceEth} ETH
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Artwork and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Artwork */}
          <ArtworkZoom
            imageUrl={auction.artwork_url || ''}
            title={auction.title}
            artist={auction.artist?.name}
            metadata={auction.artwork_metadata}
            className="w-full"
          />

          {/* Description */}
          {auction.description && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {auction.description}
                </p>
              </div>
            </div>
          )}

          {/* Artwork Details */}
          {auction.artwork_metadata && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Artwork Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {auction.artwork_metadata.medium && (
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">
                      Medium
                    </p>
                    <p className="text-white font-medium">
                      {auction.artwork_metadata.medium}
                    </p>
                  </div>
                )}
                {auction.artwork_metadata.dimensions && (
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">
                      Dimensions
                    </p>
                    <p className="text-white font-medium">
                      {auction.artwork_metadata.dimensions}
                    </p>
                  </div>
                )}
                {auction.artwork_metadata.year && (
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">
                      Year
                    </p>
                    <p className="text-white font-medium">
                      {auction.artwork_metadata.year}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide">
                    Edition
                  </p>
                  <p className="text-white font-medium">1 of 1</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Bid History/Activity Toggle */}
          {(isMobile || isTablet) && (
            <div>
              <div className="flex border-b border-gray-700 mb-4">
                <button
                  onClick={() => setActiveTab("bids")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === "bids"
                      ? "text-brand-400 border-b-2 border-brand-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Bid History ({bids.length})
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === "activity"
                      ? "text-brand-400 border-b-2 border-brand-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Activity ({activity.length})
                </button>
              </div>

              {activeTab === "bids" ? (
                <BidHistoryWithData auctionId={auction.id} initialBids={bids} />
              ) : (
                <ActivityFeed activity={activity} />
              )}
            </div>
          )}
        </div>

        {/* Right Column - Auction Controls and Info */}
        <div className="space-y-6">
          {/* Timer */}
          <AuctionTimer
            end_time={auction.end_time}
            start_time={auction.start_time}
            status={auction.status === "draft" ? "upcoming" : auction.status}
          />

          {/* Bidding Interface */}
          <BiddingInterface
            auction={auction}
            nextMinBid={nextMinBid}
            isUserWinning={isUserWinning}
            onBidPlaced={handleBidPlaced}
          />

          {/* Artist Profile */}
          {auction.artist && <ArtistProfile artist={{...auction.artist, id: 'unknown'}} />}

          {/* Desktop Bid History */}
          {!isMobile && !isTablet && (
            <BidHistoryWithData auctionId={auction.id} initialBids={bids} />
          )}

          {/* Desktop Activity Feed */}
          {!isMobile && !isTablet && <ActivityFeed activity={activity} />}

          {/* User's Bid Summary */}
          {address && userBids.length > 0 && (
            <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Your Bids</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bids:</span>
                  <span className="text-white font-medium">
                    {userBids.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Highest Bid:</span>
                  <span className="text-white font-medium">
                    {userBids[0] ? formatEther(BigInt(userBids[0].amount)) : "0"} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Chip
                    size="sm"
                    color={isUserWinning ? "success" : "warning"}
                    variant="flat"
                  >
                    {isUserWinning ? "Winning" : "Outbid"}
                  </Chip>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
