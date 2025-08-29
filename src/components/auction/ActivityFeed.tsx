import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { formatEther } from "viem";
import { AuctionActivity } from "@/types";

interface ActivityFeedProps {
  activity: AuctionActivity[];
  className?: string;
}

export function ActivityFeed({ activity, className }: ActivityFeedProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diff = now.getTime() - activityTime.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "bid":
        return (
          <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-brand-400"
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
        );
      case "auction_start":
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h6m-7 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      case "auction_end":
        return (
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "price_update":
        return (
          <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V3a1 1 0 011-1h6a1 1 0 011 1v1M5 6h14l-1 14H6L5 6z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const getActivityText = (item: AuctionActivity) => {
    switch (item.type) {
      case "bid":
        const bidAmount = item.amount ? formatEther(BigInt(item.amount)) : "0";
        const bidder =
          item.user_profile?.name ||
          (item.user_address ? formatAddress(item.user_address) : "Anonymous");
        return {
          primary: `${bidder} placed a bid`,
          secondary: `${bidAmount} ETH`,
        };
      case "auction_start":
        return {
          primary: "Auction started",
          secondary: "Bidding is now open",
        };
      case "auction_end":
        return {
          primary: "Auction ended",
          secondary: "Bidding has closed",
        };
      case "price_update":
        const newPrice = item.amount ? formatEther(BigInt(item.amount)) : "0";
        return {
          primary: "Starting price updated",
          secondary: `New starting price: ${newPrice} ETH`,
        };
      default:
        return {
          primary: "Activity recorded",
          secondary: "",
        };
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-white">
          Activity Feed {activity.length > 0 && `(${activity.length})`}
        </h3>
      </CardHeader>

      <CardBody>
        {activity.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-gray-400">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activity.map((item, index) => {
              const { primary, secondary } = getActivityText(item);

              return (
                <div key={item.id} className="flex items-start gap-3">
                  {getActivityIcon(item.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">{primary}</p>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatTimeAgo(item.created_at)}
                      </span>
                    </div>

                    {secondary && (
                      <p className="text-sm text-gray-400 mt-1">{secondary}</p>
                    )}

                    {item.transaction_hash && (
                      <a
                        href={`https://etherscan.io/tx/${item.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1 mt-1"
                      >
                        View transaction
                        <svg
                          className="w-3 h-3"
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
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Real-time indicator */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Live updates
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
