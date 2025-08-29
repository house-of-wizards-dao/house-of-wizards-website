import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { useAccount, useBalance } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAuctionBid } from "@/lib/auction-contract";
import { useToast } from "@/hooks/useToast";
import { Auction } from "@/types";

interface BiddingInterfaceProps {
  auction: Auction;
  nextMinBid: string;
  isUserWinning: boolean;
  onBidPlaced?: (bidAmount: string, transactionHash: string) => void;
  className?: string;
}

export function BiddingInterface({
  auction,
  nextMinBid,
  isUserWinning,
  onBidPlaced,
  className,
}: BiddingInterfaceProps) {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { placeBid, isPending, error: bidError } = useAuctionBid();
  const { success: showSuccess, error: showError } = useToast();

  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextMinBidEth = formatEther(BigInt(nextMinBid));
  const currentBidEth = formatEther(BigInt(auction.current_bid));

  const isAuctionActive =
    auction.status === "active" && new Date() < new Date(auction.end_time);
  const hasEnoughBalance = balance
    ? parseEther(bidAmount || "0") <= balance.value
    : false;
  const isBidValid =
    bidAmount && parseFloat(bidAmount) >= parseFloat(nextMinBidEth);

  const handleQuickBid = (multiplier: number) => {
    const quickBidAmount = (parseFloat(nextMinBidEth) * multiplier).toFixed(6);
    setBidAmount(quickBidAmount);
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address || !isBidValid || !isAuctionActive) return;

    setIsSubmitting(true);

    try {
      // Extract auction index from auction ID (contract-auction-0 -> 0)
      const auctionIndex = parseInt(
        auction.id.replace("contract-auction-", ""),
      );

      if (isNaN(auctionIndex)) {
        throw new Error("Invalid auction ID format");
      }

      console.log(`Placing bid of ${bidAmount} ETH on auction ${auctionIndex}`);

      // Call the real smart contract
      const result = await placeBid(auctionIndex, bidAmount);

      if (result.success) {
        const txHash = result.hash || "pending";
        console.log("✅ Bid placed successfully! Transaction hash:", txHash);

        // Call parent callback with the real transaction hash
        onBidPlaced?.(parseEther(bidAmount).toString(), txHash);

        // Show success with more details
        showSuccess(
          `Your bid of ${bidAmount} ETH has been placed successfully! Transaction hash: ${txHash.slice(0, 10)}...`,
          "Bid Placed Successfully! 🎉",
        );

        setBidAmount("");

        // Add a note about page refresh
        setTimeout(() => {
          showSuccess(
            "Page will refresh in a few seconds to show updated auction data...",
            "Updating...",
          );
        }, 2000);
      }
    } catch (error) {
      console.error("Bid submission error:", error);
      showError(
        error instanceof Error ? error.message : "Failed to place bid",
        "Bid Failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Place Your Bid</h3>
        {isUserWinning && (
          <Chip color="success" variant="flat" size="sm">
            Winning Bid
          </Chip>
        )}
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Current Bid Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg">
          <div>
            <p className="text-sm text-gray-400">Current Bid</p>
            <p className="text-xl font-bold text-white">{currentBidEth} ETH</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Minimum Bid</p>
            <p className="text-lg font-semibold text-brand-500">
              {nextMinBidEth} ETH
            </p>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-6">
            <p className="text-gray-400 mb-4">
              Connect your wallet to place a bid
            </p>
            <ConnectButton />
          </div>
        ) : !isAuctionActive ? (
          <div className="text-center py-6">
            <p className="text-gray-400">
              {auction.status === "upcoming"
                ? "Auction has not started yet"
                : "Auction has ended"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitBid} className="space-y-4">
            {/* Quick Bid Buttons */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Quick Bid</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleQuickBid(1)}
                >
                  Min Bid
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleQuickBid(1.1)}
                >
                  +10%
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleQuickBid(1.25)}
                >
                  +25%
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleQuickBid(1.5)}
                >
                  +50%
                </Button>
              </div>
            </div>

            {/* Bid Amount Input */}
            <Input
              type="number"
              step="0.001"
              min={nextMinBidEth}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Minimum: ${nextMinBidEth} ETH`}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">ETH</span>
                </div>
              }
              classNames={{
                input: "text-right",
              }}
              isInvalid={bidAmount !== "" && !isBidValid}
              errorMessage={
                bidAmount !== "" && !isBidValid
                  ? `Bid must be at least ${nextMinBidEth} ETH`
                  : ""
              }
            />

            {/* Balance Check */}
            {balance && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Your Balance:</span>
                <span
                  className={
                    hasEnoughBalance ? "text-green-400" : "text-red-400"
                  }
                >
                  {formatEther(balance.value)} ETH
                </span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-brand-500 to-brand-600 text-white"
              isLoading={isSubmitting || isPending}
              isDisabled={!isBidValid || !hasEnoughBalance || !isAuctionActive}
            >
              {isSubmitting || isPending
                ? "Placing Bid..."
                : `Place Bid ${bidAmount ? `(${bidAmount} ETH)` : ""}`}
            </Button>

            {/* Error Messages */}
            {bidError && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">
                  {bidError.message || "Failed to place bid"}
                </p>
              </div>
            )}

            {/* Warnings */}
            {bidAmount && !hasEnoughBalance && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">
                  Insufficient balance. You need at least {bidAmount} ETH to
                  place this bid.
                </p>
              </div>
            )}
          </form>
        )}

        {/* Transaction Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Gas fees will apply for each bid transaction</p>
          <p>• Your bid is binding and cannot be withdrawn</p>
          <p>• You can increase your bid at any time</p>
        </div>
      </CardBody>
    </Card>
  );
}
