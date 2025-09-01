import { useState, useCallback, useEffect } from "react";
import { Auction, Bid, AuctionActivity } from "@/types";

interface UseAuctionDataOptions {
  auction: Auction;
  bids: Bid[];
  activity: AuctionActivity[];
}

/**
 * Enhanced auction data hook that can refresh from smart contract
 */
export function useAuctionDataWithRefresh(
  auctionId: string,
  initialData?: UseAuctionDataOptions,
) {
  const [state, setState] = useState({
    auction: initialData?.auction || null,
    bids: initialData?.bids || [],
    activity: initialData?.activity || [],
    isLoading: false,
    error: null as string | null,
  });

  // Function to refresh auction data from smart contract
  const refresh = useCallback(async () => {
    console.log("🔄 Refreshing auction data from smart contract...");

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Import services dynamically
      const { ContractAuctionService } = await import(
        "@/lib/services/contract-auction-service"
      );
      const { BidHistoryService } = await import(
        "@/lib/services/bid-history-service"
      );

      // Extract auction index from ID (contract-auction-0 -> 0)
      const auctionIndex = parseInt(auctionId.replace("contract-auction-", ""));

      if (!isNaN(auctionIndex)) {
        console.log(`🔍 Fetching fresh data for auction ${auctionIndex}...`);

        // Get both auction data and bid history in parallel
        const [freshAuction, freshBids] = await Promise.all([
          ContractAuctionService.getAuctionByIndex(auctionIndex),
          BidHistoryService.getBidHistory(auctionIndex),
        ]);

        if (freshAuction) {
          console.log("✅ Fresh auction data received:", {
            title: freshAuction.title,
            currentBid: freshAuction.current_bid,
            totalBids: freshAuction.total_bids,
            bidHistoryCount: freshBids.length,
          });

          setState((prev) => ({
            ...prev,
            auction: freshAuction,
            bids: freshBids,
            isLoading: false,
            error: null,
          }));
        }
      }
    } catch (error) {
      console.error("❌ Failed to refresh auction data:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to refresh auction data",
      }));
    }
  }, [auctionId]);

  // Add bid optimistically
  const addBid = useCallback((bid: Bid) => {
    setState((prev) => ({
      ...prev,
      bids: [bid, ...prev.bids],
    }));
  }, []);

  // Add activity
  const addActivity = useCallback((activity: AuctionActivity) => {
    setState((prev) => ({
      ...prev,
      activity: [activity, ...prev.activity],
    }));
  }, []);

  // Auto-refresh on mount if it's a contract auction
  useEffect(() => {
    if (auctionId.startsWith("contract-auction-")) {
      // Refresh data on mount to get latest blockchain state
      refresh();
    }
  }, [auctionId, refresh]);

  return {
    auction: state.auction,
    bids: state.bids,
    activity: state.activity,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
    addBid,
    addActivity,
  };
}
