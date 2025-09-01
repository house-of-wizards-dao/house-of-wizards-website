import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { AuctionService } from "@/lib/services/auction-service";
import { requireAdmin, AuthenticatedUser } from "@/lib/auth";
import {
  createApiHandler,
  sendSuccess,
  ApiValidationError,
  ApiErrorCode,
} from "@/lib/api-middleware";
import { logger } from "@/lib/logger";
import { cacheManager } from "@/lib/cache-manager";

// Admin search schema with enhanced filtering
const adminAuctionSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  query: z.string().optional(),
  sort_by: z
    .enum([
      "created_at",
      "updated_at",
      "start_time",
      "end_time",
      "current_bid",
      "total_bids",
    ])
    .default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  status: z.string().optional(),
  created_by: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  featured: z.coerce.boolean().optional(),
  has_bids: z.coerce.boolean().optional(),
});

// Admin auction creation schema
const adminCreateAuctionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000),
  artwork_id: z.string().uuid(),
  starting_bid: z.number().min(0),
  reserve_price: z.number().min(0).optional(),
  bid_increment: z.number().min(0.01),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "active"]).default("draft"),
});

// Admin auction update schema
const adminUpdateAuctionSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  starting_bid: z.number().min(0).optional(),
  reserve_price: z.number().min(0).optional().nullable(),
  bid_increment: z.number().min(0.01).optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "active", "ended", "cancelled"]).optional(),
});

async function adminAuctionsHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "GET":
        return await handleGetAuctions(req, res, user, auctionService);
      case "POST":
        return await handleCreateAuction(req, res, user, auctionService);
      case "PUT":
        return await handleUpdateAuction(req, res, user, auctionService);
      case "DELETE":
        return await handleDeleteAuction(req, res, user, auctionService);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        throw new ApiValidationError(
          ApiErrorCode.BAD_REQUEST,
          "Method not allowed",
        );
    }
  } catch (error) {
    logger.error("Admin auctions API error", {
      error,
      method: req.method,
      url: req.url,
      adminId: user.id,
    });
    throw error;
  }
}

async function handleGetAuctions(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  // Check cache first
  const cacheKey = `admin:auctions:${JSON.stringify(req.query)}`;
  const cached = await cacheManager.get(cacheKey);
  if (cached) {
    return sendSuccess(res, cached, "Auctions retrieved from cache");
  }

  const validatedParams = adminAuctionSearchSchema.parse(req.query);

  // Build enhanced search parameters for admin view
  const searchParams = {
    query: validatedParams.query,
    page: validatedParams.page,
    limit: validatedParams.limit,
    sort_by: validatedParams.sort_by,
    sort_order: validatedParams.sort_order,
    filters: {
      status: validatedParams.status
        ? [validatedParams.status as import("@/types/auction").AuctionStatus]
        : undefined,
      created_by: validatedParams.created_by,
      featured: validatedParams.featured,
      start_date: validatedParams.date_from,
      end_date: validatedParams.date_to,
    },
  };

  // Remove undefined values from filters
  Object.keys(searchParams.filters).forEach((key) => {
    if (
      searchParams.filters[key as keyof typeof searchParams.filters] ===
      undefined
    ) {
      delete searchParams.filters[key as keyof typeof searchParams.filters];
    }
  });

  const result = await auctionService.searchAuctions(searchParams);

  // Add admin-specific metadata
  const enhancedResult = {
    ...result,
    auctions: result.auctions.map((auction) => ({
      ...auction,
      is_admin_view: true,
      can_moderate: true,
    })),
    admin_stats: {
      total_active: result.auctions.filter((a) => a.status === "active").length,
      total_draft: result.auctions.filter((a) => a.status === "draft").length,
      total_ended: result.auctions.filter((a) => a.status === "ended").length,
      total_featured: result.auctions.filter((a) => a.featured).length,
    },
  };

  // Cache for 5 minutes
  await cacheManager.set(cacheKey, enhancedResult, {
    ttl: 300,
    tags: ["admin", "auctions"],
  });

  logger.info("Admin auctions retrieved", {
    adminId: user.id,
    totalResults: result.total,
    page: validatedParams.page,
    filters: searchParams.filters,
  });

  sendSuccess(res, enhancedResult, "Auctions retrieved successfully", {
    page: result.page,
    limit: result.limit,
    total: result.total,
    hasMore: result.hasNext,
  });
}

async function handleCreateAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  const validatedData = adminCreateAuctionSchema.parse(req.body);

  // Validate auction timing
  const startTime = new Date(validatedData.start_time);
  const endTime = new Date(validatedData.end_time);
  const now = new Date();

  if (startTime >= endTime) {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "End time must be after start time",
    );
  }

  if (endTime <= now) {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "End time must be in the future",
    );
  }

  // Validate reserve price vs starting bid
  if (
    validatedData.reserve_price &&
    validatedData.reserve_price < validatedData.starting_bid
  ) {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "Reserve price must be greater than or equal to starting bid",
    );
  }

  const auction = await auctionService.createAuction(validatedData, user.id);

  // Invalidate related caches
  await cacheManager.invalidateByTags(["admin", "auctions", "artworks"]);

  logger.info("Admin created auction", {
    auctionId: auction.id,
    adminId: user.id,
    artworkId: validatedData.artwork_id,
    status: validatedData.status,
    featured: validatedData.featured,
  });

  sendSuccess(res, auction, "Auction created successfully");
}

async function handleUpdateAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  const { auction_id } = req.query;

  if (!auction_id || typeof auction_id !== "string") {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "Auction ID is required",
    );
  }

  const validatedData = adminUpdateAuctionSchema.parse(req.body);

  // Additional validation for timing if provided
  if (validatedData.start_time && validatedData.end_time) {
    const startTime = new Date(validatedData.start_time);
    const endTime = new Date(validatedData.end_time);

    if (startTime >= endTime) {
      throw new ApiValidationError(
        ApiErrorCode.VALIDATION_ERROR,
        "End time must be after start time",
      );
    }
  }

  const auction = await auctionService.updateAuction(
    auction_id,
    validatedData,
    user.id,
  );

  // Invalidate caches
  await cacheManager.invalidateByTags([
    "admin",
    "auctions",
    `auction:${auction_id}`,
  ]);

  logger.info("Admin updated auction", {
    auctionId: auction_id,
    adminId: user.id,
    changes: Object.keys(validatedData),
  });

  sendSuccess(res, auction, "Auction updated successfully");
}

async function handleDeleteAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  const { auction_id } = req.query;

  if (!auction_id || typeof auction_id !== "string") {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "Auction ID is required",
    );
  }

  // Check if auction exists and get its status
  const existingAuction = await auctionService.getAuction(auction_id);

  if (!existingAuction) {
    throw new ApiValidationError(ApiErrorCode.NOT_FOUND, "Auction not found");
  }

  // Prevent deletion of active auctions with bids
  if (existingAuction.status === "active" && existingAuction.total_bids > 0) {
    throw new ApiValidationError(
      ApiErrorCode.CONFLICT,
      "Cannot delete active auction with bids. Cancel the auction instead.",
    );
  }

  await auctionService.deleteAuction(auction_id, user.id);

  // Invalidate caches
  await cacheManager.invalidateByTags([
    "admin",
    "auctions",
    `auction:${auction_id}`,
  ]);

  logger.warn("Admin deleted auction", {
    auctionId: auction_id,
    adminId: user.id,
    auctionTitle: existingAuction.title,
    auctionStatus: existingAuction.status,
  });

  sendSuccess(
    res,
    { deleted: true, auction_id },
    "Auction deleted successfully",
  );
}

// Create the API handler with comprehensive security
const handler = createApiHandler(requireAdmin(adminAuctionsHandler), {
  methods: ["GET", "POST", "PUT", "DELETE"],
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  cors: true,
  monitoring: {
    trackPerformance: true,
    logRequests: true,
  },
  cache: {
    maxAge: 300, // 5 minutes for GET requests
    tags: ["admin", "auctions"],
  },
});

export default handler;
