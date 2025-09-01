import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { logger } from "@/lib/logger";
import type {
  Auction,
  Bid,
  AuctionSearchParams,
  AuctionListResponse,
  BidListResponse,
  PlaceBidRequest,
  CreateAuctionRequest,
  UpdateAuctionRequest,
  BidValidationResult,
  AuctionTimeRemaining,
} from "@/types/auction";

interface UseAuctionsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useAuctions(
  params?: AuctionSearchParams,
  options: UseAuctionsOptions = {},
) {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const { autoRefresh = true, refreshInterval = 30000 } = options;
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      if (params?.query) queryParams.append("query", params.query);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        queryParams.append("sort_order", params.sort_order);

      if (params?.filters) {
        const { filters } = params;
        if (filters.status)
          queryParams.append("status", filters.status.join(","));
        if (filters.artist_id)
          queryParams.append("artist_id", filters.artist_id);
        if (filters.price_min !== undefined)
          queryParams.append("price_min", filters.price_min.toString());
        if (filters.price_max !== undefined)
          queryParams.append("price_max", filters.price_max.toString());
        if (filters.start_date)
          queryParams.append("start_date", filters.start_date);
        if (filters.end_date) queryParams.append("end_date", filters.end_date);
        if (filters.featured !== undefined)
          queryParams.append("featured", filters.featured.toString());
        if (filters.has_reserve !== undefined)
          queryParams.append("has_reserve", filters.has_reserve.toString());
        if (filters.category) queryParams.append("category", filters.category);
      }

      const response = await fetch(`/api/auctions?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }

      const result: AuctionListResponse = await response.json();

      setAuctions(result.auctions);
      setPagination({
        page: result.page,
        limit: result.limit,
        total: result.total,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch auctions");
      logger.error(
        "Error fetching auctions",
        err instanceof Error ? err : new Error(String(err)),
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  // Auto-refresh functionality
  useEffect(() => {
    fetchAuctions();

    if (autoRefresh && refreshInterval > 0) {
      refreshTimer.current = setInterval(fetchAuctions, refreshInterval);
    }

    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [fetchAuctions, autoRefresh, refreshInterval]);

  const refetch = useCallback(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  return {
    auctions,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] =
    useState<AuctionTimeRemaining | null>(null);

  const fetchAuction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/auctions/${auctionId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Auction not found");
        }
        throw new Error("Failed to fetch auction");
      }

      const auctionData: Auction = await response.json();
      setAuction(auctionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch auction");
      logger.error(
        "Error fetching auction",
        err instanceof Error ? err : new Error(String(err)),
      );
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  // Calculate time remaining
  useEffect(() => {
    if (!auction) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(auction.end_time);
      const totalSeconds = Math.max(
        0,
        Math.floor((end.getTime() - now.getTime()) / 1000),
      );

      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        total_seconds: totalSeconds,
        is_ended: totalSeconds === 0,
        is_starting_soon: totalSeconds > 0 && totalSeconds <= 300,
      });
    };

    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  return {
    auction,
    loading,
    error,
    timeRemaining,
    refetch: fetchAuction,
  };
}

export function useBidding(auctionId: string) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<BidValidationResult | null>(
    null,
  );

  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/auctions/${auctionId}/bids`);

      if (!response.ok) {
        throw new Error("Failed to fetch bids");
      }

      const result: BidListResponse = await response.json();
      setBids(result.bids);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bids");
      logger.error("Error fetching bids", err);
    } finally {
      setLoading(false);
    }
  }, [auctionId]);

  const validateBid = useCallback(
    async (amount: number): Promise<BidValidationResult> => {
      try {
        const response = await fetch(
          `/api/auctions/${auctionId}/validate-bid?amount=${amount}`,
        );

        if (!response.ok) {
          throw new Error("Failed to validate bid");
        }

        const result: BidValidationResult = await response.json();
        setValidation(result);
        return result;
      } catch (err) {
        const errorResult: BidValidationResult = {
          is_valid: false,
          errors: [err instanceof Error ? err.message : "Validation failed"],
        };
        setValidation(errorResult);
        return errorResult;
      }
    },
    [auctionId],
  );

  const placeBid = useCallback(
    async (bidData: PlaceBidRequest): Promise<Bid> => {
      try {
        setPlacing(true);
        setError(null);

        const response = await fetch(`/api/auctions/${auctionId}/bids`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bidData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to place bid");
        }

        const bid: Bid = await response.json();

        // Refresh bids list
        fetchBids();

        return bid;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to place bid";
        setError(errorMessage);
        logger.error("Error placing bid", err);
        throw new Error(errorMessage);
      } finally {
        setPlacing(false);
      }
    },
    [auctionId, fetchBids],
  );

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  return {
    bids,
    loading,
    placing,
    error,
    validation,
    validateBid,
    placeBid,
    refetch: fetchBids,
  };
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/watchlist");

      if (!response.ok) {
        throw new Error("Failed to fetch watchlist");
      }

      const data = await response.json();
      setWatchlist(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch watchlist",
      );
      logger.error("Error fetching watchlist", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWatchlist = useCallback(
    async (auctionId: string): Promise<void> => {
      try {
        const response = await fetch(`/api/auctions/${auctionId}/watchlist`, {
          method: "POST",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add to watchlist");
        }

        // Refresh watchlist
        fetchWatchlist();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add to watchlist",
        );
        throw err;
      }
    },
    [fetchWatchlist],
  );

  const removeFromWatchlist = useCallback(
    async (auctionId: string): Promise<void> => {
      try {
        const response = await fetch(`/api/auctions/${auctionId}/watchlist`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to remove from watchlist");
        }

        // Refresh watchlist
        fetchWatchlist();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to remove from watchlist",
        );
        throw err;
      }
    },
    [fetchWatchlist],
  );

  const isInWatchlist = useCallback(
    (auctionId: string): boolean => {
      return watchlist.some((item) => item.auction_id === auctionId);
    },
    [watchlist],
  );

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refetch: fetchWatchlist,
  };
}

export function useAuctionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAuction = useCallback(
    async (data: CreateAuctionRequest): Promise<Auction> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auctions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create auction");
        }

        const auction: Auction = await response.json();

        // Redirect to the new auction
        router.push(`/auctions/${auction.id}`);

        return auction;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create auction";
        setError(errorMessage);
        logger.error("Error creating auction", err);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const updateAuction = useCallback(
    async (id: string, data: UpdateAuctionRequest): Promise<Auction> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/auctions/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update auction");
        }

        const auction: Auction = await response.json();
        return auction;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update auction";
        setError(errorMessage);
        logger.error("Error updating auction", err);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    createAuction,
    updateAuction,
  };
}
