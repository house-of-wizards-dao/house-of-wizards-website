import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { formatEther } from "viem";
import { Bid } from "@/types";
import { useResponsive } from "@/hooks/useResponsive";

interface BidHistoryProps {
  bids: Bid[];
  isLoading?: boolean;
  className?: string;
}

export function BidHistory({
  bids,
  isLoading = false,
  className,
}: BidHistoryProps) {
  const { isMobile } = useResponsive();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diff = now.getTime() - bidTime.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Bid History</h3>
        </CardHeader>
        <CardBody>
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Bid History {bids.length > 0 && `(${bids.length})`}
        </h3>
        {bids.length > 0 && (
          <Chip size="sm" variant="flat" color="primary">
            {formatEther(BigInt(bids[0].amount))} ETH Leading
          </Chip>
        )}
      </CardHeader>

      <CardBody>
        {bids.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <p className="text-gray-400">No bids yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Be the first to place a bid!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bids.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  index === 0
                    ? "bg-brand-500/10 border-brand-500/30"
                    : "bg-gray-800/50 border-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    src={bid.bidder_profile?.avatar_url}
                    name={
                      bid.bidder_profile?.name ||
                      formatAddress(bid.bidder_address)
                    }
                    classNames={{
                      base: index === 0 ? "ring-2 ring-brand-500" : "",
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">
                        {bid.bidder_profile?.name ||
                          formatAddress(bid.bidder_address)}
                      </p>
                      {index === 0 && (
                        <Chip size="sm" color="success" variant="flat">
                          Leading
                        </Chip>
                      )}
                    </div>

                    {!isMobile && (
                      <p className="text-xs text-gray-400">
                        {formatTimeAgo(bid.created_at)}
                        {bid.transaction_hash && (
                          <span className="ml-2">
                            •{" "}
                            <a
                              href={`https://etherscan.io/tx/${bid.transaction_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-400 hover:text-brand-300 transition-colors"
                            >
                              View tx
                            </a>
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold ${
                      index === 0 ? "text-brand-400" : "text-white"
                    }`}
                  >
                    {formatEther(BigInt(bid.amount))} ETH
                  </p>
                  {isMobile && (
                    <p className="text-xs text-gray-400">
                      {formatTimeAgo(bid.created_at)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show more button if there are many bids */}
        {bids.length > 10 && (
          <div className="mt-4 text-center">
            <button className="text-brand-400 hover:text-brand-300 text-sm transition-colors">
              View all {bids.length} bids
            </button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
