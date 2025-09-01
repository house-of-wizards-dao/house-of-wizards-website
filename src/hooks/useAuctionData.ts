import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
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
 * Hook to manage real-time auction data
 */
export function useAuctionData(
  auctionId: string,
  initialData?: UseAuctionDataOptions,
) {
  const { address } = useAccount();
  const [state, setState] = useState<AuctionDataState>({
    auction: initialData?.auction || null,
    bids: initialData?.bids || [],
    activity: initialData?.activity || [],
    isLoading: !initialData,
    error: null,
    userBids: [],
    isUserWinning: false,
    nextMinBid: "0",
  });

  // Calculate derived state
  useEffect(() => {
    if (!state.auction || !address) return;

    const userBids = state.bids.filter(
      (bid) => bid.bidder_address.toLowerCase() === address.toLowerCase(),
    );

    const highestBid = state.bids.length > 0 ? state.bids[0] : null;
    const isUserWinning =
      highestBid?.bidder_address.toLowerCase() === address.toLowerCase();

    // Calculate next minimum bid
    const currentBid = BigInt(state.auction.current_bid ?? 0);
    const increment = BigInt(
      (state.auction as any).min_bid_increment ?? state.auction.bid_increment,
    );
    const nextMinBid = (currentBid + increment).toString();

    setState((prev) => ({
      ...prev,
      userBids,
      isUserWinning,
      nextMinBid,
    }));
  }, [state.bids, state.auction, address]);

  // Fetch auction data
  const fetchAuctionData = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`/api/auctions/${auctionId}`);
      if (!response.ok) throw new Error("Failed to fetch auction data");

      const data = await response.json();

      setState((prev) => ({
        ...prev,
        auction: data.auction,
        bids: data.bids,
        activity: data.activity,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      }));
    }
  };

  // Real-time updates via polling (in production, use WebSocket)
  useEffect(() => {
    if (!auctionId || initialData) return;

    fetchAuctionData();

    const interval = setInterval(fetchAuctionData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [auctionId]);

  // Add new bid to state (optimistic update)
  const addBid = (bid: Bid) => {
    setState((prev) => ({
      ...prev,
      bids: [bid, ...prev.bids].sort((a, b) =>
        Number(BigInt(b.amount) - BigInt(a.amount)),
      ),
      auction: prev.auction
        ? {
            ...prev.auction,
            current_bid: Number(bid.amount),
            total_bids: prev.auction.total_bids + 1,
          }
        : null,
    }));
  };

  // Add activity to state
  const addActivity = (activity: AuctionActivity) => {
    setState((prev) => ({
      ...prev,
      activity: [activity, ...prev.activity],
    }));
  };

  return {
    ...state,
    refresh: fetchAuctionData,
    addBid,
    addActivity,
  };
}
