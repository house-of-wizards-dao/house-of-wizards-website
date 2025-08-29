import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createApiHandler } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import {
  createAuctionSchema,
  auctionSearchSchema,
} from "@/lib/validation-schemas";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "GET":
        return await handleGetAuctions(req, res, auctionService);
      case "POST":
        return await handleCreateAuction(req, res, auctionService);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    logger.error("Error in auctions API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleGetAuctions(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
) {
  // Parse query parameters
  const queryParams = {
    query: req.query.query as string,
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    sort_by: req.query.sort_by as string,
    sort_order: req.query.sort_order as "asc" | "desc",
    // Parse filters from query string
    filters: {
      status: req.query.status
        ? (req.query.status as string).split(",")
        : undefined,
      artist_id: req.query.artist_id as string,
      price_min: req.query.price_min
        ? parseFloat(req.query.price_min as string)
        : undefined,
      price_max: req.query.price_max
        ? parseFloat(req.query.price_max as string)
        : undefined,
      start_date: req.query.start_date as string,
      end_date: req.query.end_date as string,
      featured: req.query.featured ? req.query.featured === "true" : undefined,
      has_reserve: req.query.has_reserve
        ? req.query.has_reserve === "true"
        : undefined,
      category: req.query.category as string,
    },
  };

  // Remove undefined values from filters
  Object.keys(queryParams.filters).forEach((key) => {
    if (
      queryParams.filters[key as keyof typeof queryParams.filters] === undefined
    ) {
      delete queryParams.filters[key as keyof typeof queryParams.filters];
    }
  });

  // Validate parameters
  try {
    const validatedParams = auctionSearchSchema.parse(queryParams);
    const result = await auctionService.searchAuctions(validatedParams);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid query parameters",
        details: error.errors,
      });
    }
    throw error;
  }
}

async function handleCreateAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
) {
  // Validate request body
  try {
    const validatedData = createAuctionSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const auction = await auctionService.createAuction(validatedData, userId);

    res.status(201).json(auction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid auction data",
        details: error.errors,
      });
    }
    throw error;
  }
}

export default createApiHandler(handler, {
  requireAuth: false, // GET doesn't require auth, POST will check in handler
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
});
