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

// Admin artwork search schema
const adminArtworkSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  query: z.string().optional(),
  sort_by: z.enum(["created_at", "updated_at", "title"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  artist_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  has_auctions: z.coerce.boolean().optional(),
});

// Admin artwork creation schema
const adminCreateArtworkSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000),
  artist_id: z.string().uuid(),
  medium: z.string().max(100).optional(),
  dimensions: z.string().max(100).optional(),
  year_created: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  estimated_value: z.number().min(0).optional(),
  provenance: z.string().max(1000).optional(),
  condition_report: z.string().max(1000).optional(),
  image_urls: z.array(z.string().url()).optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

// Admin artwork update schema
const adminUpdateArtworkSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  medium: z.string().max(100).optional(),
  dimensions: z.string().max(100).optional(),
  year_created: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional(),
  estimated_value: z.number().min(0).optional(),
  provenance: z.string().max(1000).optional(),
  condition_report: z.string().max(1000).optional(),
  image_urls: z.array(z.string().url()).optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

async function adminArtworksHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "GET":
        return await handleGetArtworks(req, res, user, auctionService);
      case "POST":
        return await handleCreateArtwork(req, res, user, auctionService);
      case "PUT":
        return await handleUpdateArtwork(req, res, user, auctionService);
      case "DELETE":
        return await handleDeleteArtwork(req, res, user, auctionService);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        throw new ApiValidationError(
          ApiErrorCode.BAD_REQUEST,
          "Method not allowed",
        );
    }
  } catch (error) {
    logger.error("Admin artworks API error", {
      error,
      method: req.method,
      url: req.url,
      adminId: user.id,
    });
    throw error;
  }
}

async function handleGetArtworks(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  // Check cache first
  const cacheKey = `admin:artworks:${JSON.stringify(req.query)}`;
  const cached = await cacheManager.get(cacheKey);
  if (cached) {
    return sendSuccess(res, cached, "Artworks retrieved from cache");
  }

  const validatedParams = adminArtworkSearchSchema.parse(req.query);

  // Build search parameters
  const searchParams = {
    page: validatedParams.page,
    limit: validatedParams.limit,
    status: validatedParams.status,
    artist_id: validatedParams.artist_id,
  };

  const result = await auctionService.searchArtworks(searchParams);

  // Add admin-specific data and auction information
  const enhancedArtworks = await Promise.all(
    result.artworks.map(async (artwork) => {
      const hasActiveAuctions = await auctionService.hasActiveAuctions(
        artwork.id,
      );

      return {
        ...artwork,
        is_admin_view: true,
        can_moderate: true,
        has_active_auctions: hasActiveAuctions,
        auction_eligible: artwork.status === "approved" && !hasActiveAuctions,
      };
    }),
  );

  const enhancedResult = {
    ...result,
    artworks: enhancedArtworks,
    admin_stats: {
      total_pending: result.artworks.filter((a) => a.status === "pending")
        .length,
      total_approved: result.artworks.filter((a) => a.status === "approved")
        .length,
      total_rejected: result.artworks.filter((a) => a.status === "rejected")
        .length,
      total_with_auctions: enhancedArtworks.filter((a) => a.has_active_auctions)
        .length,
    },
  };

  // Cache for 5 minutes
  await cacheManager.set(cacheKey, enhancedResult, 300, ["admin", "artworks"]);

  logger.info("Admin artworks retrieved", {
    adminId: user.id,
    totalResults: result.total,
    page: validatedParams.page,
    status: validatedParams.status,
  });

  sendSuccess(res, enhancedResult, "Artworks retrieved successfully", {
    page: result.page,
    limit: result.limit,
    total: result.total,
    hasMore: result.hasNext,
  });
}

async function handleCreateArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  const validatedData = adminCreateArtworkSchema.parse(req.body);

  // Validate year if provided
  if (validatedData.year_created) {
    const currentYear = new Date().getFullYear();
    if (validatedData.year_created > currentYear) {
      throw new ApiValidationError(
        ApiErrorCode.VALIDATION_ERROR,
        "Year created cannot be in the future",
      );
    }
  }

  const artwork = await auctionService.createArtwork(validatedData, user.id);

  // Invalidate related caches
  await cacheManager.invalidateByTags(["admin", "artworks"]);

  logger.info("Admin created artwork", {
    artworkId: artwork.id,
    adminId: user.id,
    artistId: validatedData.artist_id,
    status: validatedData.status,
    title: validatedData.title,
  });

  sendSuccess(res, artwork, "Artwork created successfully");
}

async function handleUpdateArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  const { artwork_id } = req.query;

  if (!artwork_id || typeof artwork_id !== "string") {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "Artwork ID is required",
    );
  }

  const validatedData = adminUpdateArtworkSchema.parse(req.body);

  // Validate year if provided
  if (validatedData.year_created) {
    const currentYear = new Date().getFullYear();
    if (validatedData.year_created > currentYear) {
      throw new ApiValidationError(
        ApiErrorCode.VALIDATION_ERROR,
        "Year created cannot be in the future",
      );
    }
  }

  // Check if artwork has active auctions before allowing certain changes
  const hasActiveAuctions = await auctionService.hasActiveAuctions(artwork_id);

  if (hasActiveAuctions && validatedData.status === "rejected") {
    throw new ApiValidationError(
      ApiErrorCode.CONFLICT,
      "Cannot reject artwork that has active auctions",
    );
  }

  const artwork = await auctionService.updateArtwork(
    artwork_id,
    validatedData,
    user.id,
  );

  // Invalidate caches
  await cacheManager.invalidateByTags([
    "admin",
    "artworks",
    `artwork:${artwork_id}`,
  ]);

  logger.info("Admin updated artwork", {
    artworkId: artwork_id,
    adminId: user.id,
    changes: Object.keys(validatedData),
    newStatus: validatedData.status,
  });

  sendSuccess(res, artwork, "Artwork updated successfully");
}

async function handleDeleteArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
  auctionService: AuctionService,
) {
  const { artwork_id } = req.query;

  if (!artwork_id || typeof artwork_id !== "string") {
    throw new ApiValidationError(
      ApiErrorCode.VALIDATION_ERROR,
      "Artwork ID is required",
    );
  }

  // Check if artwork exists
  const existingArtwork = await auctionService.getArtwork(artwork_id);

  if (!existingArtwork) {
    throw new ApiValidationError(ApiErrorCode.NOT_FOUND, "Artwork not found");
  }

  // Prevent deletion of artworks with active auctions
  const hasActiveAuctions = await auctionService.hasActiveAuctions(artwork_id);

  if (hasActiveAuctions) {
    throw new ApiValidationError(
      ApiErrorCode.CONFLICT,
      "Cannot delete artwork that has active auctions",
    );
  }

  await auctionService.deleteArtwork(artwork_id, user.id);

  // Invalidate caches
  await cacheManager.invalidateByTags([
    "admin",
    "artworks",
    `artwork:${artwork_id}`,
  ]);

  logger.warn("Admin deleted artwork", {
    artworkId: artwork_id,
    adminId: user.id,
    artworkTitle: existingArtwork.title,
    artistId: existingArtwork.artist_id,
  });

  sendSuccess(
    res,
    { deleted: true, artwork_id },
    "Artwork deleted successfully",
  );
}

// Create the API handler with comprehensive security
const handler = createApiHandler(requireAdmin(adminArtworksHandler), {
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
    tags: ["admin", "artworks"],
  },
});

export default handler;
