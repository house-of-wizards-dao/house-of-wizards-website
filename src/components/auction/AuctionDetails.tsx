import { motion } from "framer-motion";
import { Card, CardBody } from "@nextui-org/card";
import { Badge } from "@nextui-org/react";
import { formatEther } from "viem";
import {
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

import type { Auction, Bid } from "@/types";

interface AuctionDetailsProps {
  auction: Auction;
  currentBid: Bid | null;
  nextMinBid: string;
  totalBids: number;
  className?: string;
}

export function AuctionDetails({
  auction,
  currentBid,
  nextMinBid,
  totalBids,
  className,
}: AuctionDetailsProps) {
  const currentBidAmount = currentBid
    ? formatEther(BigInt(currentBid.amount))
    : formatEther(BigInt(auction.start_price || auction.starting_bid));

  const nextMinBidAmount = formatEther(BigInt(nextMinBid));
  const startingPrice = formatEther(
    BigInt(auction.start_price || auction.starting_bid),
  );
  const bidIncrement = formatEther(BigInt(auction.bid_increment));

  const priceIncrease = currentBid
    ? ((Number(currentBidAmount) - Number(startingPrice)) /
        Number(startingPrice)) *
      100
    : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Bid Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-neutral-800/80 to-neutral-900/80 border border-neutral-700">
          <CardBody className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-brand-400" />
                  <span className="text-sm text-neutral-400 uppercase tracking-wide">
                    {currentBid ? "Current Bid" : "Starting Price"}
                  </span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">
                  {currentBidAmount} ETH
                </div>
                {priceIncrease > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge color="success" variant="flat" size="sm">
                      +{priceIncrease.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      from starting price
                    </span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-neutral-400 text-sm mb-1">
                  Next Min Bid
                </div>
                <div className="text-2xl font-semibold text-brand-400">
                  {nextMinBidAmount} ETH
                </div>
              </div>
            </div>

            {/* Bid Progress Bar */}
            {currentBid && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-neutral-400 mb-2">
                  <span>Starting: {startingPrice} ETH</span>
                  <span>Current: {currentBidAmount} ETH</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(priceIncrease * 2, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-brand-500 to-brand-400 h-2 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Current Bidder Info */}
            {currentBid && (
              <div className="p-4 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm">Current Leader</p>
                    <p className="font-mono text-white">
                      {`${currentBid.bidder_address.slice(0, 6)}...${currentBid.bidder_address.slice(-4)}`}
                    </p>
                  </div>
                  <Badge color="success" variant="flat">
                    Winning
                  </Badge>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Auction Statistics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Bids */}
          <Card className="bg-neutral-800/50 border border-neutral-700">
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-brand-500/20 rounded-full flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-brand-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {totalBids}
              </div>
              <div className="text-sm text-neutral-400">Total Bids</div>
            </CardBody>
          </Card>

          {/* Starting Price */}
          <Card className="bg-neutral-800/50 border border-neutral-700">
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {startingPrice}
              </div>
              <div className="text-sm text-neutral-400">
                Starting Price (ETH)
              </div>
            </CardBody>
          </Card>

          {/* Min Increment */}
          <Card className="bg-neutral-800/50 border border-neutral-700">
            <CardBody className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <InformationCircleIcon className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {bidIncrement}
              </div>
              <div className="text-sm text-neutral-400">
                Min Increment (ETH)
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* Auction Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-neutral-800/30 border border-neutral-700/50">
          <CardBody className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Auction Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 text-sm">Auction ID</span>
                    <span className="text-white text-sm font-mono">
                      {auction.id.slice(0, 8)}...
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-400 text-sm">Start Time</span>
                    <span className="text-white text-sm">
                      {new Date(auction.start_time).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-400 text-sm">End Time</span>
                    <span className="text-white text-sm">
                      {new Date(auction.end_time).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {auction.contract_address && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-sm">Contract</span>
                      <a
                        href={`https://etherscan.io/address/${auction.contract_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-400 text-sm hover:text-brand-300 transition-colors font-mono"
                      >
                        {auction.contract_address.slice(0, 6)}...
                        {auction.contract_address.slice(-4)}
                      </a>
                    </div>
                  )}

                  {auction.token_id && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-sm">Token ID</span>
                      <span className="text-white text-sm font-mono">
                        #{auction.token_id}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-neutral-400 text-sm">Status</span>
                    <Badge
                      color={
                        auction.status === "active"
                          ? "success"
                          : auction.status === "ended"
                            ? "danger"
                            : auction.status === "draft"
                              ? "warning"
                              : "default"
                      }
                      variant="flat"
                      size="sm"
                    >
                      {auction.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
