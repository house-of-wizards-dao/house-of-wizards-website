import { getServiceSupabase } from "../supabase";
import { logger } from "../logger";
import { createDatabaseErrorContext, createLogContext } from "../error-utils";
import type {
  Auction,
  Artwork,
  Bid,
  WatchlistItem,
  AuctionSearchParams,
  AuctionListResponse,
  BidListResponse,
  AuctionStatsResponse,
  BidValidationResult,
  AuctionTimeRemaining,
  CreateAuctionRequest,
  UpdateAuctionRequest,
  CreateArtworkRequest,
  UpdateArtworkRequest,
  PlaceBidRequest,
  AuctionEvent,
} from "../../types/auction";

export class AuctionService {
  private supabase = getServiceSupabase();

  // Artwork Management
  async createArtwork(
    data: CreateArtworkRequest,
    createdBy: string,
  ): Promise<Artwork> {
    logger.info("Creating artwork", {
      artistId: data.artist_id,
      title: data.title,
    });

    const artworkData = {
      ...data,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: artwork, error } = await this.supabase
      .from("artworks")
      .insert(artworkData)
      .select(
        `
        *,
        artist:profiles!artist_id(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error creating artwork", createDatabaseErrorContext(error, "insert", "artworks", { artistId: data.artist_id, title: data.title }));
      throw new Error(`Failed to create artwork: ${error.message}`);
    }

    // Log the creation
    await this.logActivity("artwork_created", artwork.id, createdBy, {
      artwork_title: artwork.title,
    });

    return {
      ...artwork,
      artist_name: artwork.artist?.name,
    };
  }

  async updateArtwork(
    id: string,
    data: UpdateArtworkRequest,
    updatedBy: string,
  ): Promise<Artwork> {
    logger.info("Updating artwork", { id, updatedBy });

    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: artwork, error } = await this.supabase
      .from("artworks")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        artist:profiles!artist_id(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error updating artwork", createDatabaseErrorContext(error, "update", "artworks", { artworkId: id }));
      throw new Error(`Failed to update artwork: ${error.message}`);
    }

    await this.logActivity("artwork_updated", id, updatedBy, {
      changes: Object.keys(data),
    });

    return {
      ...artwork,
      artist_name: artwork.artist?.name,
    };
  }

  async getArtwork(id: string): Promise<Artwork | null> {
    const { data: artwork, error } = await this.supabase
      .from("artworks")
      .select(
        `
        *,
        artist:profiles!artist_id(name)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      logger.error("Error fetching artwork", createDatabaseErrorContext(error, "select", "artworks", { artworkId: id }));
      throw new Error(`Failed to fetch artwork: ${error.message}`);
    }

    return {
      ...artwork,
      artist_name: artwork.artist?.name,
    };
  }

  // Auction Management
  async createAuction(
    data: CreateAuctionRequest,
    createdBy: string,
  ): Promise<Auction> {
    logger.info("Creating auction", {
      artworkId: data.artwork_id,
      title: data.title,
    });

    // Verify artwork exists and is approved
    const artwork = await this.getArtwork(data.artwork_id);
    if (!artwork) {
      throw new Error("Artwork not found");
    }
    if (artwork.status !== "approved") {
      throw new Error("Artwork must be approved before creating auction");
    }

    // Check for existing active auctions for this artwork
    const { data: existingAuctions } = await this.supabase
      .from("auctions")
      .select("id")
      .eq("artwork_id", data.artwork_id)
      .in("status", ["draft", "active"])
      .limit(1);

    if (existingAuctions && existingAuctions.length > 0) {
      throw new Error("Artwork already has an active auction");
    }

    const auctionData = {
      ...data,
      status: "draft" as const,
      current_bid: null,
      total_bids: 0,
      winner_id: null,
      created_by: createdBy,
      featured: data.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: auction, error } = await this.supabase
      .from("auctions")
      .insert(auctionData)
      .select(
        `
        *,
        artwork:artworks(*),
        creator:profiles!created_by(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error creating auction", createDatabaseErrorContext(error, "insert", "auctions", { artworkId: data.artwork_id, startingBid: data.starting_bid }));
      throw new Error(`Failed to create auction: ${error.message}`);
    }

    await this.logActivity("auction_created", auction.id, createdBy, {
      auction_title: auction.title,
      starting_bid: auction.starting_bid,
    });

    return {
      ...auction,
      created_by_name: auction.creator?.name,
    };
  }

  async updateAuction(
    id: string,
    data: UpdateAuctionRequest,
    updatedBy: string,
  ): Promise<Auction> {
    logger.info("Updating auction", { id, updatedBy });

    // Get current auction to check status
    const currentAuction = await this.getAuction(id);
    if (!currentAuction) {
      throw new Error("Auction not found");
    }

    // Prevent certain updates on active auctions
    if (currentAuction.status === "active") {
      const restrictedFields = ["starting_bid", "start_time", "artwork_id"];
      const hasRestrictedChanges = restrictedFields.some(
        (field) =>
          field in data &&
          data[field as keyof UpdateAuctionRequest] !== undefined,
      );

      if (hasRestrictedChanges) {
        throw new Error(
          "Cannot modify starting bid, start time, or artwork on active auctions",
        );
      }
    }

    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: auction, error } = await this.supabase
      .from("auctions")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        artwork:artworks(*),
        creator:profiles!created_by(name),
        winner:profiles!winner_id(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error updating auction", createDatabaseErrorContext(error, "update", "auctions", { auctionId: id }));
      throw new Error(`Failed to update auction: ${error.message}`);
    }

    await this.logActivity("auction_updated", id, updatedBy, {
      changes: Object.keys(data),
    });

    return {
      ...auction,
      created_by_name: auction.creator?.name,
      winner_name: auction.winner?.name,
    };
  }

  async getAuction(id: string): Promise<Auction | null> {
    const { data: auction, error } = await this.supabase
      .from("auctions")
      .select(
        `
        *,
        artwork:artworks(*),
        creator:profiles!created_by(name),
        winner:profiles!winner_id(name)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      logger.error("Error fetching auction", createDatabaseErrorContext(error, "select", "auctions", { auctionId: id }));
      throw new Error(`Failed to fetch auction: ${error.message}`);
    }

    return {
      ...auction,
      created_by_name: auction.creator?.name,
      winner_name: auction.winner?.name,
    };
  }

  async searchAuctions(
    params: AuctionSearchParams,
  ): Promise<AuctionListResponse> {
    const {
      query,
      filters = {},
      sort_by = "created_at",
      sort_order = "desc",
      page = 1,
      limit = 10,
    } = params;

    // Add timeout wrapper for database search
    const databaseSearchWithTimeout = async () => {
      // Temporarily skip database search until tables are created
      logger.warn(
        "Database auctions table not available, returning empty result",
      );
      return {
        auctions: [],
        total: 0,
        page,
        limit,
        hasNext: false,
        hasPrev: false,
      };
    };

    // Hybrid approach: Get both database auctions and smart contract auctions
    // Temporarily disable smart contract search to improve performance
    const results = await Promise.allSettled([
      databaseSearchWithTimeout(),
      // this.searchSmartContractAuctions(params)
      Promise.resolve([]), // Return empty array for now
    ]);

    const databaseAuctions =
      results[0].status === "fulfilled" ? results[0].value.auctions : [];
    const contractAuctions =
      results[1].status === "fulfilled" ? results[1].value : [];

    // Combine and sort auctions
    const allAuctions = [...databaseAuctions, ...contractAuctions];

    // Apply sorting to combined results
    const sortedAuctions = this.sortCombinedAuctions(
      allAuctions,
      sort_by,
      sort_order,
    );

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedAuctions = sortedAuctions.slice(from, to);

    const total = allAuctions.length;
    const totalPages = Math.ceil(total / limit);

    return {
      auctions: paginatedAuctions,
      total,
      page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  private async searchDatabaseAuctions(
    params: AuctionSearchParams,
  ): Promise<AuctionListResponse> {
    const {
      query,
      filters = {},
      sort_by = "created_at",
      sort_order = "desc",
      page = 1,
      limit = 10,
    } = params;

    // First check if the auctions table exists
    const { error: tableCheckError } = await this.supabase
      .from("auctions")
      .select("id")
      .limit(1);

    if (tableCheckError) {
      logger.warn("Auctions table not available", {
        error: tableCheckError.message,
      });
      // Return empty result if table doesn't exist
      return {
        auctions: [],
        total: 0,
        page,
        limit,
        hasNext: false,
        hasPrev: false,
      };
    }

    let queryBuilder = this.supabase.from("auctions").select(
      `
        *,
        artwork:artworks(*),
        creator:profiles!created_by(name),
        winner:profiles!winner_id(name)
      `,
      { count: "exact" },
    );

    // Apply text search
    if (query) {
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,artwork.title.ilike.%${query}%`,
      );
    }

    // Apply filters
    if (filters.status?.length) {
      queryBuilder = queryBuilder.in("status", filters.status);
    }
    if (filters.artist_id) {
      queryBuilder = queryBuilder.eq("artwork.artist_id", filters.artist_id);
    }
    if (filters.price_min !== undefined) {
      queryBuilder = queryBuilder.gte("current_bid", filters.price_min);
    }
    if (filters.price_max !== undefined) {
      queryBuilder = queryBuilder.lte("current_bid", filters.price_max);
    }
    if (filters.start_date) {
      queryBuilder = queryBuilder.gte("start_time", filters.start_date);
    }
    if (filters.end_date) {
      queryBuilder = queryBuilder.lte("end_time", filters.end_date);
    }
    if (filters.featured !== undefined) {
      queryBuilder = queryBuilder.eq("featured", filters.featured);
    }
    if (filters.has_reserve !== undefined) {
      if (filters.has_reserve) {
        queryBuilder = queryBuilder.not("reserve_price", "is", null);
      } else {
        queryBuilder = queryBuilder.is("reserve_price", null);
      }
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sort_by, {
      ascending: sort_order === "asc",
    });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data: auctions, error, count } = await queryBuilder;

    if (error) {
      logger.error("Error searching auctions", createDatabaseErrorContext(error, "select", "auctions", { params }));
      throw new Error(`Failed to search auctions: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      auctions: (auctions || []).map((auction) => ({
        ...auction,
        created_by_name: auction.creator?.name,
        winner_name: auction.winner?.name,
      })),
      total,
      page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  private async searchSmartContractAuctions(
    params: AuctionSearchParams,
  ): Promise<Auction[]> {
    try {
      // Add timeout to prevent hanging on blockchain calls
      const timeoutPromise = new Promise<Auction[]>((_, reject) => {
        setTimeout(
          () => reject(new Error("Smart contract fetch timeout")),
          3000,
        );
      });

      const fetchPromise = (async () => {
        const { ContractAuctionService } = await import(
          "./contract-auction-service"
        );

        const contractAuctions = await ContractAuctionService.getAllAuctions();

        // Apply basic filtering to smart contract auctions
        let filteredAuctions = contractAuctions;

        if (params.query) {
          const queryLower = params.query.toLowerCase();
          filteredAuctions = filteredAuctions.filter(
            (auction) =>
              auction.title?.toLowerCase().includes(queryLower) ||
              auction.description?.toLowerCase().includes(queryLower),
          );
        }

        if (params.filters?.status?.length) {
          filteredAuctions = filteredAuctions.filter((auction) =>
            params.filters!.status!.includes(auction.status as any),
          );
        }

        return filteredAuctions;
      })();

      // Race between fetch and timeout
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      return result;
    } catch (error) {
      logger.warn("Failed to fetch smart contract auctions", createLogContext(error));
      return [];
    }
  }

  private sortCombinedAuctions(
    auctions: Auction[],
    sortBy: string,
    sortOrder: "asc" | "desc",
  ): Auction[] {
    return auctions.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "current_bid":
          aValue = parseFloat(String(a.current_bid || "0"));
          bValue = parseFloat(String(b.current_bid || "0"));
          break;
        case "end_time":
          aValue = new Date(a.end_time).getTime();
          bValue = new Date(b.end_time).getTime();
          break;
        case "total_bids":
          aValue = a.total_bids || 0;
          bValue = b.total_bids || 0;
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at || 0).getTime();
          bValue = new Date(b.created_at || 0).getTime();
          break;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  async getAuctionWithContract(id: string): Promise<Auction | null> {
    // Check if it's a smart contract auction
    if (id.startsWith("contract-auction-")) {
      try {
        const { ContractAuctionService } = await import(
          "./contract-auction-service"
        );

        const auctionIndex = parseInt(id.replace("contract-auction-", ""));
        if (!isNaN(auctionIndex)) {
          return await ContractAuctionService.getAuctionByIndex(auctionIndex);
        }
      } catch (error) {
        logger.error("Failed to fetch smart contract auction", createLogContext(error));
        return null;
      }
    }

    // Otherwise fetch from database
    const { data: auction, error } = await this.supabase
      .from("auctions")
      .select(
        `
        *,
        artwork:artworks(*),
        creator:profiles!created_by(name),
        winner:profiles!winner_id(name)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      logger.error("Error fetching auction", createDatabaseErrorContext(error, "select", "auctions", { auctionId: id }));
      throw new Error(`Failed to fetch auction: ${error.message}`);
    }

    return {
      ...auction,
      created_by_name: auction.creator?.name,
      winner_name: auction.winner?.name,
    };
  }

  // Bidding System
  async validateBid(
    auctionId: string,
    amount: number,
    userId: string,
  ): Promise<BidValidationResult> {
    const auction = await this.getAuction(auctionId);

    if (!auction) {
      return {
        is_valid: false,
        errors: ["Auction not found"],
      };
    }

    const errors: string[] = [];

    // Check auction status
    if (auction.status !== "active") {
      errors.push("Auction is not active");
    }

    // Check auction timing
    const now = new Date();
    const startTime = new Date(auction.start_time);
    const endTime = new Date(auction.end_time);

    if (now < startTime) {
      errors.push("Auction has not started yet");
    }
    if (now > endTime) {
      errors.push("Auction has ended");
    }

    // Check bid amount
    const currentBid = auction.current_bid || 0;
    const minimumBid =
      currentBid > 0
        ? currentBid + auction.bid_increment
        : auction.starting_bid;

    if (amount < minimumBid) {
      errors.push(`Bid must be at least $${minimumBid.toFixed(2)}`);
    }

    // Check if user is auction creator
    if (userId === auction.created_by) {
      errors.push("Cannot bid on your own auction");
    }

    // Check current winning bidder
    const currentWinningBid = await this.getCurrentWinningBid(auctionId);
    if (currentWinningBid && currentWinningBid.bidder_id === userId) {
      errors.push("You are already the highest bidder");
    }

    // Rate limiting check
    const recentBids = await this.getRecentBidsByUser(userId, 60); // Last 60 seconds
    if (recentBids.length >= 5) {
      errors.push(
        "Too many bids placed recently. Please wait before bidding again.",
      );
    }

    return {
      is_valid: errors.length === 0,
      errors,
      suggested_bid: minimumBid,
      min_increment: auction.bid_increment,
    };
  }

  async placeBid(
    auctionId: string,
    data: PlaceBidRequest,
    userId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Bid> {
    logger.info("Placing bid", { auctionId, userId, amount: data.amount });

    // Validate bid
    const validation = await this.validateBid(auctionId, data.amount, userId);
    if (!validation.is_valid) {
      throw new Error(validation.errors.join(", "));
    }

    const bidData = {
      auction_id: auctionId,
      bidder_id: userId,
      amount: data.amount,
      max_bid: data.max_bid,
      status: "active" as const,
      is_auto_bid: false,
      placed_at: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    };

    const { data: bid, error } = await this.supabase
      .from("bids")
      .insert(bidData)
      .select(
        `
        *,
        auction:auctions(title),
        bidder:profiles!bidder_id(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error placing bid", createDatabaseErrorContext(error, "insert", "bids", { auctionId: data.auction_id, amount: data.amount }));
      throw new Error(`Failed to place bid: ${error.message}`);
    }

    // Update auction current bid and total bids
    await this.updateAuctionBidInfo(auctionId);

    // Mark previous bids as outbid
    await this.markPreviousBidsAsOutbid(auctionId, bid.id);

    // Add to bid history
    await this.addToBidHistory(bid);

    // Check for auction extension (anti-sniping)
    await this.checkAuctionExtension(auctionId);

    // Emit real-time event
    await this.emitAuctionEvent("bid_placed", auctionId, {
      bid: {
        id: bid.id,
        amount: bid.amount,
        bidder_name: bid.bidder?.name,
        placed_at: bid.placed_at,
      },
      timestamp: new Date().toISOString(),
    });

    await this.logActivity("bid_placed", auctionId, userId, {
      amount: data.amount,
      bid_id: bid.id,
    });

    return {
      ...bid,
      auction_title: bid.auction?.title,
      bidder_name: bid.bidder?.name,
    };
  }

  async getCurrentWinningBid(auctionId: string): Promise<Bid | null> {
    const { data: bid, error } = await this.supabase
      .from("bids")
      .select(
        `
        *,
        auction:auctions(title),
        bidder:profiles!bidder_id(name)
      `,
      )
      .eq("auction_id", auctionId)
      .eq("status", "active")
      .order("amount", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      logger.error("Error fetching current winning bid", createDatabaseErrorContext(error, "select", "bids", { auctionId }));
      return null;
    }

    return {
      ...bid,
      auction_title: bid.auction?.title,
      bidder_name: bid.bidder?.name,
    };
  }

  async getUserBids(
    userId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<BidListResponse> {
    const { page = 1, limit = 10 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: bids,
      error,
      count,
    } = await this.supabase
      .from("bids")
      .select(
        `
        *,
        auction:auctions(title, status, end_time),
        bidder:profiles!bidder_id(name)
      `,
        { count: "exact" },
      )
      .eq("bidder_id", userId)
      .order("placed_at", { ascending: false })
      .range(from, to);

    if (error) {
      logger.error("Error fetching user bids", createDatabaseErrorContext(error, "select", "bids", { userId }));
      throw new Error(`Failed to fetch user bids: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      bids: (bids || []).map((bid) => ({
        ...bid,
        auction_title: bid.auction?.title,
        bidder_name: bid.bidder?.name,
      })),
      total,
      page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  // Watchlist Management
  async addToWatchlist(
    userId: string,
    auctionId: string,
  ): Promise<WatchlistItem> {
    const { data: item, error } = await this.supabase
      .from("watchlist")
      .insert({
        user_id: userId,
        auction_id: auctionId,
        created_at: new Date().toISOString(),
      })
      .select(
        `
        *,
        auction:auctions(title)
      `,
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Auction already in watchlist");
      }
      logger.error("Error adding to watchlist", createDatabaseErrorContext(error, "insert", "auction_watchlist", { auctionId, userId }));
      throw new Error(`Failed to add to watchlist: ${error.message}`);
    }

    return {
      ...item,
      auction_title: item.auction?.title,
    };
  }

  async removeFromWatchlist(userId: string, auctionId: string): Promise<void> {
    const { error } = await this.supabase
      .from("watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("auction_id", auctionId);

    if (error) {
      logger.error("Error removing from watchlist", createDatabaseErrorContext(error, "delete", "auction_watchlist", { auctionId, userId }));
      throw new Error(`Failed to remove from watchlist: ${error.message}`);
    }
  }

  async getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
    const { data: items, error } = await this.supabase
      .from("watchlist")
      .select(
        `
        *,
        auction:auctions(title, status, end_time, current_bid)
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Error fetching watchlist", createDatabaseErrorContext(error, "select", "auction_watchlist", { userId }));
      throw new Error(`Failed to fetch watchlist: ${error.message}`);
    }

    return (items || []).map((item) => ({
      ...item,
      auction_title: item.auction?.title,
    }));
  }

  // Admin Functions
  async getAuctionStats(): Promise<AuctionStatsResponse> {
    const [
      totalAuctions,
      activeAuctions,
      totalBids,
      auctionValues,
      topBidders,
    ] = await Promise.all([
      this.supabase
        .from("auctions")
        .select("id", { count: "exact", head: true }),
      this.supabase
        .from("auctions")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      this.supabase.from("bids").select("id", { count: "exact", head: true }),
      this.supabase
        .from("auctions")
        .select("current_bid")
        .not("current_bid", "is", null),
      this.supabase
        .from("bids")
        .select(
          `
          bidder_id,
          amount,
          bidder:profiles!bidder_id(name)
        `,
        )
        .limit(10),
    ]);

    const totalValue =
      auctionValues.data?.reduce(
        (sum, auction) => sum + (auction.current_bid || 0),
        0,
      ) || 0;
    const avgAuctionValue = totalAuctions.count
      ? totalValue / totalAuctions.count
      : 0;

    // Process top bidders
    const bidderStats = new Map<
      string,
      { name: string; total_bids: number; total_amount: number }
    >();
    topBidders.data?.forEach((bid) => {
      const existing = bidderStats.get(bid.bidder_id);
      if (existing) {
        existing.total_bids++;
        existing.total_amount += bid.amount;
      } else {
        bidderStats.set(bid.bidder_id, {
          name: bid.bidder?.name || "Unknown",
          total_bids: 1,
          total_amount: bid.amount,
        });
      }
    });

    const topBiddersArray = Array.from(bidderStats.entries())
      .map(([user_id, stats]) => ({ user_id, user_name: stats.name, ...stats }))
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 5);

    return {
      total_auctions: totalAuctions.count || 0,
      active_auctions: activeAuctions.count || 0,
      total_bids: totalBids.count || 0,
      total_value: totalValue,
      avg_auction_value: avgAuctionValue,
      top_bidders: topBiddersArray,
    };
  }

  // Utility Functions
  getTimeRemaining(endTime: string): AuctionTimeRemaining {
    const now = new Date();
    const end = new Date(endTime);
    const totalSeconds = Math.max(
      0,
      Math.floor((end.getTime() - now.getTime()) / 1000),
    );

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      total_seconds: totalSeconds,
      is_ended: totalSeconds === 0,
      is_starting_soon: totalSeconds > 0 && totalSeconds <= 300, // 5 minutes
    };
  }

  // Private helper methods
  private async updateAuctionBidInfo(auctionId: string): Promise<void> {
    const { data: bidStats, error } = await this.supabase.rpc(
      "update_auction_bid_stats",
      { auction_id: auctionId },
    );

    if (error) {
      logger.error("Error updating auction bid info", createDatabaseErrorContext(error, "update", "auctions", { auctionId }));
    }
  }

  private async markPreviousBidsAsOutbid(
    auctionId: string,
    newBidId: string,
  ): Promise<void> {
    await this.supabase
      .from("bids")
      .update({ status: "outbid" })
      .eq("auction_id", auctionId)
      .neq("id", newBidId)
      .eq("status", "active");
  }

  private async addToBidHistory(bid: Bid): Promise<void> {
    await this.supabase.from("bid_history").insert({
      auction_id: bid.auction_id,
      bidder_id: bid.bidder_id,
      amount: bid.amount,
      placed_at: bid.placed_at,
      was_winning: true,
    });
  }

  private async checkAuctionExtension(auctionId: string): Promise<void> {
    const auction = await this.getAuction(auctionId);
    if (!auction) return;

    const now = new Date();
    const endTime = new Date(auction.end_time);
    const timeLeft = endTime.getTime() - now.getTime();

    // Extend auction by 10 minutes if bid placed in last 10 minutes
    if (timeLeft > 0 && timeLeft <= 10 * 60 * 1000) {
      const newEndTime = new Date(now.getTime() + 10 * 60 * 1000);

      await this.supabase
        .from("auctions")
        .update({
          end_time: newEndTime.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", auctionId);

      await this.emitAuctionEvent("auction_extended", auctionId, {
        message: "Auction extended by 10 minutes due to recent bid",
        auction: { end_time: newEndTime.toISOString() },
        timestamp: new Date().toISOString(),
      });
    }
  }

  private async getRecentBidsByUser(
    userId: string,
    seconds: number,
  ): Promise<Bid[]> {
    const cutoff = new Date(Date.now() - seconds * 1000).toISOString();

    const { data: bids, error } = await this.supabase
      .from("bids")
      .select("id, placed_at")
      .eq("bidder_id", userId)
      .gte("placed_at", cutoff);

    if (error) {
      logger.error("Error fetching recent bids", createDatabaseErrorContext(error, "select", "bids", { userId, seconds }));
      return [];
    }

    return bids || [];
  }

  private async emitAuctionEvent(
    type: AuctionEvent["type"],
    auctionId: string,
    data: AuctionEvent["data"],
  ): Promise<void> {
    const event: AuctionEvent = {
      type,
      auction_id: auctionId,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
      },
    };

    // Emit to real-time subscribers
    await this.supabase.channel(`auction:${auctionId}`).send({
      type: "broadcast",
      event: type,
      payload: event,
    });

    logger.info("Emitted auction event", { type, auctionId });
  }

  private async logActivity(
    action: string,
    resourceId: string,
    userId: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.supabase.from("activity_logs").insert({
      action,
      resource_type: "auction",
      resource_id: resourceId,
      user_id: userId,
      metadata,
      created_at: new Date().toISOString(),
    });
  }

  // Additional methods referenced in API routes
  async getAuctionBids(
    auctionId: string,
    params: { page?: number; limit?: number } = {},
  ): Promise<BidListResponse> {
    // Check if it's a smart contract auction
    if (auctionId.startsWith("contract-auction-")) {
      try {
        const { BidHistoryService } = await import("./bid-history-service");

        const auctionIndex = parseInt(
          auctionId.replace("contract-auction-", ""),
        );
        if (!isNaN(auctionIndex)) {
          const contractBids =
            await BidHistoryService.getBidHistory(auctionIndex);

          // Apply pagination to smart contract bids
          const { page = 1, limit = 20 } = params;
          const from = (page - 1) * limit;
          const to = from + limit;
          const paginatedBids = contractBids.slice(from, to);

          const total = contractBids.length;
          const totalPages = Math.ceil(total / limit);

          return {
            bids: paginatedBids,
            total,
            page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          };
        }
      } catch (error) {
        logger.error("Failed to fetch smart contract auction bids", createLogContext(error));
        // Fall back to empty results for smart contract auctions if fetch fails
        return {
          bids: [],
          total: 0,
          page: 1,
          limit: 20,
          hasNext: false,
          hasPrev: false,
        };
      }
    }

    // Otherwise fetch from database for regular auctions
    const { page = 1, limit = 20 } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data: bids,
      error,
      count,
    } = await this.supabase
      .from("bids")
      .select(
        `
        *,
        auction:auctions(title),
        bidder:profiles!bidder_id(name)
      `,
        { count: "exact" },
      )
      .eq("auction_id", auctionId)
      .order("amount", { ascending: false })
      .order("placed_at", { ascending: true }) // Earlier bids win ties
      .range(from, to);

    if (error) {
      logger.error("Error fetching auction bids", createDatabaseErrorContext(error, "select", "bids", { auctionId, page, limit }));
      throw new Error(`Failed to fetch auction bids: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      bids: (bids || []).map((bid) => ({
        ...bid,
        auction_title: bid.auction?.title,
        bidder_name: bid.bidder?.name,
      })),
      total,
      page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async trackAuctionView(
    auctionId: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.supabase.from("auction_views").insert({
        auction_id: auctionId,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        viewed_at: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error tracking auction view", createLogContext(error, { auctionId, userId }));
      // Don't throw error for tracking failures
    }
  }

  async deleteAuction(id: string, userId: string): Promise<void> {
    logger.info("Deleting auction", { id, userId });

    const { error } = await this.supabase
      .from("auctions")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Error deleting auction", createDatabaseErrorContext(error, "delete", "auctions", { auctionId: id }));
      throw new Error(`Failed to delete auction: ${error.message}`);
    }

    await this.logActivity("auction_deleted", id, userId);
  }

  async searchArtworks(params: {
    page?: number;
    limit?: number;
    status?: string;
    artist_id?: string;
  }): Promise<{
    artworks: Artwork[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const { page = 1, limit = 20, status, artist_id } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let queryBuilder = this.supabase.from("artworks").select(
      `
        *,
        artist:profiles!artist_id(name)
      `,
      { count: "exact" },
    );

    if (status) {
      queryBuilder = queryBuilder.eq("status", status);
    }
    if (artist_id) {
      queryBuilder = queryBuilder.eq("artist_id", artist_id);
    }

    queryBuilder = queryBuilder
      .order("created_at", { ascending: false })
      .range(from, to);

    const { data: artworks, error, count } = await queryBuilder;

    if (error) {
      logger.error("Error searching artworks", createDatabaseErrorContext(error, "select", "artworks", { params }));
      throw new Error(`Failed to search artworks: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      artworks: (artworks || []).map((artwork) => ({
        ...artwork,
        artist_name: artwork.artist?.name,
      })),
      total,
      page,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async hasActiveAuctions(artworkId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("auctions")
      .select("id")
      .eq("artwork_id", artworkId)
      .in("status", ["active", "draft"])
      .limit(1);

    if (error) {
      logger.error("Error checking active auctions", createDatabaseErrorContext(error, "select", "auctions", { artworkId }));
      return false;
    }

    return (data || []).length > 0;
  }

  async deleteArtwork(id: string, userId: string): Promise<void> {
    logger.info("Deleting artwork", { id, userId });

    const { error } = await this.supabase
      .from("artworks")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Error deleting artwork", createDatabaseErrorContext(error, "delete", "artworks", { artworkId: id }));
      throw new Error(`Failed to delete artwork: ${error.message}`);
    }

    await this.logActivity("artwork_deleted", id, userId);
  }

  async moderateAuction(data: any, userId: string): Promise<any> {
    const { auction_id, action, reason, extend_minutes } = data;

    logger.info("Moderating auction", { auction_id, action, userId });

    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case "approve":
        updateData.status = "active";
        break;
      case "reject":
      case "cancel":
        updateData.status = "cancelled";
        break;
      case "feature":
        updateData.featured = true;
        break;
      case "unfeature":
        updateData.featured = false;
        break;
      case "extend":
        if (extend_minutes) {
          const currentAuction = await this.getAuction(auction_id);
          if (currentAuction) {
            const newEndTime = new Date(
              new Date(currentAuction.end_time).getTime() +
                extend_minutes * 60 * 1000,
            );
            updateData.end_time = newEndTime.toISOString();
          }
        }
        break;
    }

    const { data: auction, error } = await this.supabase
      .from("auctions")
      .update(updateData)
      .eq("id", auction_id)
      .select(
        `
        *,
        artwork:artworks(*),
        creator:profiles!created_by(name),
        winner:profiles!winner_id(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error moderating auction", createDatabaseErrorContext(error, "update", "auctions", { auctionId: auction_id, action, reason }));
      throw new Error(`Failed to moderate auction: ${error.message}`);
    }

    await this.logActivity(`auction_${action}`, auction_id, userId, { reason });

    return {
      ...auction,
      created_by_name: auction.creator?.name,
      winner_name: auction.winner?.name,
    };
  }

  async bulkModerateAuctions(data: any, userId: string): Promise<any> {
    const { auction_ids, action, reason } = data;

    logger.info("Bulk moderating auctions", { auction_ids, action, userId });

    const results = [];
    for (const auction_id of auction_ids) {
      try {
        const result = await this.moderateAuction(
          { auction_id, action, reason },
          userId,
        );
        results.push({ auction_id, success: true, result });
      } catch (error) {
        results.push({
          auction_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { results };
  }

  async moderateArtwork(data: any, userId: string): Promise<any> {
    const { artwork_id, action, reason } = data;

    logger.info("Moderating artwork", { artwork_id, action, userId });

    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case "approve":
        updateData.status = "approved";
        break;
      case "reject":
        updateData.status = "rejected";
        break;
      case "flag":
        // Add to metadata for flagged content
        updateData.metadata = {
          flagged: true,
          flagged_at: new Date().toISOString(),
          flagged_by: userId,
          flag_reason: reason,
        };
        break;
    }

    const { data: artwork, error } = await this.supabase
      .from("artworks")
      .update(updateData)
      .eq("id", artwork_id)
      .select(
        `
        *,
        artist:profiles!artist_id(name)
      `,
      )
      .single();

    if (error) {
      logger.error("Error moderating artwork", createDatabaseErrorContext(error, "update", "artworks", { artworkId: artwork_id, action, reason }));
      throw new Error(`Failed to moderate artwork: ${error.message}`);
    }

    await this.logActivity(`artwork_${action}`, artwork_id, userId, { reason });

    return {
      ...artwork,
      artist_name: artwork.artist?.name,
    };
  }

  async bulkModerateArtworks(data: any, userId: string): Promise<any> {
    const { artwork_ids, action, reason } = data;

    logger.info("Bulk moderating artworks", { artwork_ids, action, userId });

    const results = [];
    for (const artwork_id of artwork_ids) {
      try {
        const result = await this.moderateArtwork(
          { artwork_id, action, reason },
          userId,
        );
        results.push({ artwork_id, success: true, result });
      } catch (error) {
        results.push({
          artwork_id,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return { results };
  }
}
