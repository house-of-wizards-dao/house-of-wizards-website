import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { formatEther } from "viem";
import { Bid } from "@/types";
import { BidHistoryService } from "@/lib/services/bid-history-service";

interface BidHistoryWithDataProps {
  auctionId: string;
  initialBids?: Bid[];
  className?: string;
}

export function BidHistoryWithData({
  auctionId,
  initialBids = [],
  className,
}: BidHistoryWithDataProps) {
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAuctionId, setLastFetchedAuctionId] = useState<string>("");

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

  const loadBidHistory = async () => {
    if (!auctionId.startsWith("contract-auction-")) {
      console.log("⚠️ Not a contract auction, skipping bid history load");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract auction index from ID (contract-auction-0 -> 0)
      const auctionIndex = parseInt(auctionId.replace("contract-auction-", ""));

      if (isNaN(auctionIndex)) {
        throw new Error(`Invalid auction ID format: ${auctionId}`);
      }

      console.log(`🔍 Loading bid history for auction ${auctionIndex}...`);
      
      // Use the improved BidHistoryService which has multiple fallback methods
      const bidHistory = await BidHistoryService.getBidHistory(auctionIndex);
      
      console.log(`📊 Bid history result: ${bidHistory.length} bids found`);
      
      if (bidHistory.length > 0) {
        setBids(bidHistory);
        console.log(`✅ Loaded ${bidHistory.length} bids for display`);
      } else {
        console.log("📭 No bids found for this auction");
        setBids([]);
      }
      
    } catch (err) {
      console.error("❌ Failed to load bid history:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to load bid history: ${errorMessage}`);
      setBids([]); // Clear any existing bids on error
    } finally {
      setIsLoading(false);
    }
  };

  // Load bid history when auction ID changes or when we need fresh data
  useEffect(() => {
    console.log("🔄 BidHistoryWithData: auctionId changed to:", auctionId);
    if (auctionId !== lastFetchedAuctionId) {
      setLastFetchedAuctionId(auctionId);
      loadBidHistory();
    }
  }, [auctionId, lastFetchedAuctionId]);

  // Update bids when initialBids change (when parent component refreshes)
  useEffect(() => {
    if (initialBids.length > 0 && initialBids !== bids) {
      console.log("🔄 BidHistoryWithData: Updating with fresh initialBids:", initialBids.length);
      setBids(initialBids);
    }
  }, [initialBids]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Bid History</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400 text-sm">
              Loading bid history from blockchain...
            </p>
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
        <div className="flex items-center gap-2">
          {bids.length > 0 && (
            <Chip size="sm" variant="flat" color="success">
              {formatEther(BigInt(bids[0].amount))} ETH Leading
            </Chip>
          )}
          <Button
            size="sm"
            variant="bordered"
            onPress={loadBidHistory}
            isDisabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        {error && (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.862-.833-2.632 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <p className="text-gray-500 text-xs mb-4">
              There might be a network issue or the auction data is not yet available.
            </p>
            <Button 
              size="sm" 
              onPress={loadBidHistory} 
              variant="bordered"
              color="danger"
            >
              Try Again
            </Button>
          </div>
        )}

        {!error && bids.length === 0 ? (
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
            <p className="text-gray-400">No bids found for this auction</p>
            <p className="text-sm text-gray-500 mt-2">
              Be the first to place a bid!
            </p>
            <div className="mt-4 text-xs text-gray-600">
              <p>Auction ID: {auctionId}</p>
              <p>Searched blockchain events and contract state</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bids.map((bid, index) => (
              <div
                key={bid.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  index === 0
                    ? "bg-brand-500/10 border-brand-500/30"
                    : "bg-gray-800/50 border-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    name={formatAddress(bid.bidder_address)}
                    classNames={{
                      base: index === 0 ? "ring-2 ring-brand-500" : "",
                      name: "text-xs font-mono",
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {formatAddress(bid.bidder_address)}
                      </p>
                      {index === 0 && (
                        <Chip size="sm" color="success" variant="flat">
                          Winning
                        </Chip>
                      )}
                    </div>
                      <div className="flex items-center gap-1">
                      <p className="text-xs text-gray-400 font-mono">
                        {bid.transaction_hash === "Direct from contract"
                          ? "Current state"
                          : bid.transaction_hash.startsWith("0x") 
                            ? `${bid.transaction_hash?.slice(0, 10)}...`
                            : bid.transaction_hash}
                      </p>
                      {bid.transaction_hash.startsWith("0x") && bid.transaction_hash !== "0x" && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${bid.transaction_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-400 hover:text-brand-300 text-xs"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-white">
                    {formatEther(BigInt(bid.amount))} ETH
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(bid.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
