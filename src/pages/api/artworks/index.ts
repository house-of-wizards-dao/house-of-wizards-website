import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createApiHandler } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { createArtworkSchema } from "@/lib/validation-schemas";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "GET":
        return await handleGetArtworks(req, res, auctionService);
      case "POST":
        return await handleCreateArtwork(req, res, auctionService);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    logger.error("Error in artworks API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleGetArtworks(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
) {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);
  const status = req.query.status as string;
  const artist_id = req.query.artist_id as string;

  try {
    const result = await auctionService.searchArtworks({
      page,
      limit,
      status: status as any,
      artist_id,
    });

    res.status(200).json(result);
  } catch (error) {
    throw error;
  }
}

async function handleCreateArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const validatedData = createArtworkSchema.parse(req.body);
    const artwork = await auctionService.createArtwork(validatedData, userId);

    res.status(201).json(artwork);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid artwork data",
        details: error.errors,
      });
    }
    throw error;
  }
}

export default createApiHandler(handler, {
  methods: ["GET", "POST"],
  rateLimit: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  cors: true,
  monitoring: {
    trackPerformance: true,
    logRequests: true,
  },
});
