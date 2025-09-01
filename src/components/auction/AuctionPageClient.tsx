// Client-side component that uses Wagmi hooks
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

import { AuctionHero } from "@/components/auction/AuctionHero";
import { AuctionDetails } from "@/components/auction/AuctionDetails";
import { BiddingInterface } from "@/components/auction/BiddingInterface";
import { BidHistoryWithData } from "@/components/auction/BidHistoryWithData";
import { ActivityFeed } from "@/components/auction/ActivityFeed";
import { ArtistInfo } from "@/components/auction/ArtistInfo";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { ArtworkDetails } from "@/components/auction/ArtworkDetails";
import { useAuctionDataWithRefresh } from "@/hooks/useAuctionDataWithRefresh";
import { useTimer } from "@/hooks/useTimer";

import type { AuctionPageProps } from "@/types";

export function AuctionPageClient({
  auction: initialAuction,
  initialBids,
  initialActivity,
}: AuctionPageProps) {
  const { address, isConnected } = useAccount();

  // Real-time auction data
  const {
    auction,
    bids,
    activity,
    isLoading,
    error,
    refresh,
    addBid,
    addActivity,
  } = useAuctionDataWithRefresh(initialAuction.id, {
    auction: initialAuction,
    bids: initialBids,
    activity: initialActivity,
  });

  // Countdown timer
  const timer = useTimer(auction?.end_time || initialAuction.end_time);

  const [activeTab, setActiveTab] = useState<
    "details" | "history" | "activity"
  >("details");
  const [showMobileActions, setShowMobileActions] = useState(false);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
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

  const currentBid = bids.length > 0 ? bids[0] : null;
  const nextMinBid = currentBid
    ? (
        BigInt(currentBid.amount) +
        BigInt((auction || initialAuction).bid_increment)
      ).toString()
    : ((auction || initialAuction).start_price ?? 0).toString();

  return (
    <>
      {/* Mobile Actions Overlay */}
      <AnimatePresence>
        {showMobileActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal lg:hidden"
            onClick={() => setShowMobileActions(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-0 left-0 right-0 bg-neutral-900 rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-neutral-600 rounded-full mx-auto mb-6" />
              <BiddingInterface
                auction={auction || initialAuction}
                nextMinBid={nextMinBid}
                isUserWinning={false}
                onBidPlaced={(amount, txHash) => {
                  refresh();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
        {/* Hero Section */}
        <AuctionHero auction={auction || initialAuction} timer={timer} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-20 relative z-10">
            {/* Left Column - Artwork & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Auction Status & Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AuctionTimer
                  end_time={(auction || initialAuction).end_time}
                  start_time={(auction || initialAuction).start_time}
                  status={
                    (auction || initialAuction).status === "draft" 
                      ? "upcoming" 
                      : (auction || initialAuction).status as "active" | "ended" | "cancelled"
                  }
                  className="mb-6"
                />
              </motion.div>

              {/* Current Bid Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AuctionDetails
                  auction={auction || initialAuction}
                  currentBid={currentBid}
                  nextMinBid={nextMinBid}
                  totalBids={(auction || initialAuction).total_bids}
                />
              </motion.div>

              {/* Mobile Bidding Button */}
              <div className="lg:hidden">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-lg py-4 rounded-2xl shadow-brand hover:shadow-brandHover transition-all duration-300"
                  onPress={() => setShowMobileActions(true)}
                  isDisabled={(auction || initialAuction).status !== "active"}
                >
                  {(auction || initialAuction).status === "active"
                    ? "Place Bid"
                    : (auction || initialAuction).status === "ended"
                      ? "Auction Ended"
                      : "Auction Not Started"}
                </Button>
              </div>

              {/* Information Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-neutral-800/50 border border-neutral-700">
                  <CardHeader>
                    <div className="flex space-x-1 w-full">
                      {[
                        { id: "details", label: "Artwork Details" },
                        {
                          id: "history",
                          label: `Bid History (${(auction || initialAuction).total_bids})`,
                        },
                        { id: "activity", label: "Activity Feed" },
                      ].map((tab) => (
                        <Button
                          key={tab.id}
                          size="sm"
                          variant={activeTab === tab.id ? "solid" : "light"}
                          className={`flex-1 ${
                            activeTab === tab.id
                              ? "bg-brand-500 text-white"
                              : "text-neutral-400 hover:text-white"
                          }`}
                          onPress={() =>
                            setActiveTab(tab.id as typeof activeTab)
                          }
                        >
                          {tab.label}
                        </Button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardBody className="p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === "details" && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArtworkDetails auction={auction || initialAuction} />
                        </motion.div>
                      )}

                      {activeTab === "history" && (
                        <motion.div
                          key="history"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <BidHistoryWithData
                            auctionId={auction?.id || initialAuction.id}
                            initialBids={bids}
                          />
                        </motion.div>
                      )}

                      {activeTab === "activity" && (
                        <motion.div
                          key="activity"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ActivityFeed activity={activity} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardBody>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Bidding & Artist */}
            <div className="space-y-6">
              {/* Desktop Bidding Interface */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="hidden lg:block"
              >
                <Card className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 border border-neutral-700 backdrop-blur-sm">
                  <CardBody className="p-6">
                    <BiddingInterface
                      auction={auction || initialAuction}
                      nextMinBid={nextMinBid}
                      isUserWinning={false}
                      onBidPlaced={(amount, txHash) => {
                        refresh();
                      }}
                    />
                  </CardBody>
                </Card>
              </motion.div>

              {/* Artist Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <ArtistInfo artist={(auction || initialAuction).artist ? {...(auction || initialAuction).artist!, id: 'unknown'} : undefined} />
              </motion.div>

              {/* Quick Auction Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 border border-neutral-700">
                  <CardBody className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Auction Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Total Bids</span>
                        <span className="text-white font-medium">
                          {(auction || initialAuction).total_bids}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Starting Price</span>
                        <span className="text-white font-medium">
                          {formatEther(
                            BigInt((auction || initialAuction).start_price ?? 0),
                          )}{" "}
                          ETH
                        </span>
                      </div>
                      {(auction || initialAuction).status === "ended" &&
                        ((auction || initialAuction) as any).winner_address && (
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-400">Winner</span>
                            <span className="text-brand-400 font-medium font-mono">
                              {`${((auction || initialAuction) as any).winner_address.slice(0, 6)}...${((auction || initialAuction) as any).winner_address.slice(-4)}`}
                            </span>
                          </div>
                        )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
