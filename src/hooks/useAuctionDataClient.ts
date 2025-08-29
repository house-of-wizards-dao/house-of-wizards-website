import { useState } from "react";
import { Auction, Bid, AuctionActivity } from "@/types";

interface AuctionDataState {
  auction: Auction | null;
  bids: Bid[];
  activity: AuctionActivity[];
  isLoading: boolean;
  error: string | null;
  userBids: Bid[];
  isUserWinning: boolean;
  nextMinBid: string;
}

interface UseAuctionDataOptions {
  auction: Auction;
  bids: Bid[];
  activity: AuctionActivity[];
}

/**
 * Client-side only hook to manage auction data
 * This version doesn't use any Web3 hooks directly to avoid SSR issues
 */
export function useAuctionDataClient(
  auctionId: string,
  initialData?: UseAuctionDataOptions,
) {
  const [state, setState] = useState<AuctionDataState>({
    auction: initialData?.auction || null,
    bids: initialData?.bids || [],
    activity: initialData?.activity || [],
    isLoading: false,
    error: null,
    userBids: [],
    isUserWinning: false,
    nextMinBid: initialData?.auction?.min_bid_increment || "0",
  });

  // Simplified refresh function
  const refresh = () => {
    // In production, this would fetch fresh data
    console.log("Refreshing auction data...");
  };

  // Add bid optimistically
  const addBid = (bid: Bid) => {
    setState((prev) => ({
      ...prev,
      bids: [bid, ...prev.bids],
    }));
  };

  // Add activity
  const addActivity = (activity: AuctionActivity) => {
    setState((prev) => ({
      ...prev,
      activity: [activity, ...prev.activity],
    }));
  };

  return {
    auction: state.auction,
    bids: state.bids,
    activity: state.activity,
    isLoading: state.isLoading,
    error: state.error,
    userBids: state.userBids,
    isUserWinning: state.isUserWinning,
    nextMinBid: state.nextMinBid,
    refresh,
    addBid,
    addActivity,
  };
}
