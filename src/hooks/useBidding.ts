import { useState, useCallback } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useAuctionBid } from "@/lib/auction-contract";
import { safeParseNumber } from "@/lib/error-utils";

interface BidData {
  amount: string;
  auctionId: string;
}

interface UseBiddingReturn {
  placeBid: (bidData: BidData) => Promise<void>;
  isPlacingBid: boolean;
  bidError: string | null;
  clearBidError: () => void;
}

export function useBidding(auctionId: string): UseBiddingReturn {
  const [bidError, setBidError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const {
    placeBid: placeBidContract,
    isPending,
    error: contractError,
  } = useAuctionBid();

  const clearBidError = useCallback(() => {
    setBidError(null);
  }, []);

  const placeBid = useCallback(
    async ({ amount, auctionId }: BidData) => {
      if (isPending || !isConnected) return;

      setBidError(null);

      try {
        if (!address) {
          throw new Error("Please connect your wallet to place a bid");
        }

        // Place bid through smart contract
        // Convert auctionId string to number for contract call
        const auctionIndex = safeParseNumber(auctionId, 0);
        const result = await placeBidContract(auctionIndex, amount);

        // Also record the bid in our backend
        const response = await fetch(`/api/auctions/${auctionId}/bids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseEther(amount).toString(),
            bidder_address: address,
            transaction_hash: result.hash,
          }),
        });

        if (!response.ok) {
          console.warn(
            "Failed to record bid in backend, but blockchain transaction succeeded",
          );
        }

        console.log("Bid placed successfully:", result);
      } catch (error) {
        console.error("Failed to place bid:", error);

        if (error instanceof Error) {
          setBidError(error.message);
        } else if (contractError) {
          setBidError(contractError.message || "Smart contract error occurred");
        } else {
          setBidError("Failed to place bid. Please try again.");
        }

        throw error;
      }
    },
    [
      isPending,
      isConnected,
      address,
      placeBidContract,
      contractError,
      auctionId,
    ],
  );

  return {
    placeBid,
    isPlacingBid: isPending,
    bidError,
    clearBidError,
  };
}
