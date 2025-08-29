import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { updateArtworkSchema } from "@/lib/validation-schemas";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid artwork ID" });
  }

  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "GET":
        return await handleGetArtwork(req, res, auctionService, id);
      case "PUT":
        return await handleUpdateArtwork(req, res, auctionService, id);
      case "DELETE":
        return await handleDeleteArtwork(req, res, auctionService, id);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    logger.error("Error in artwork API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleGetArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  id: string,
) {
  const artwork = await auctionService.getArtwork(id);

  if (!artwork) {
    return res.status(404).json({ error: "Artwork not found" });
  }

  res.status(200).json(artwork);
}

async function handleUpdateArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  id: string,
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user owns the artwork or is admin
  const existingArtwork = await auctionService.getArtwork(id);
  if (!existingArtwork) {
    return res.status(404).json({ error: "Artwork not found" });
  }

  const isArtist = existingArtwork.artist_id === userId;
  const isAdmin = req.user?.role === "admin" || req.user?.role === "moderator";

  if (!isArtist && !isAdmin) {
    return res.status(403).json({ error: "Permission denied" });
  }

  try {
    const validatedData = updateArtworkSchema.parse(req.body);
    const artwork = await auctionService.updateArtwork(
      id,
      validatedData,
      userId,
    );

    res.status(200).json(artwork);
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

async function handleDeleteArtwork(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  id: string,
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user owns the artwork or is admin
  const existingArtwork = await auctionService.getArtwork(id);
  if (!existingArtwork) {
    return res.status(404).json({ error: "Artwork not found" });
  }

  const isArtist = existingArtwork.artist_id === userId;
  const isAdmin = req.user?.role === "admin";

  if (!isArtist && !isAdmin) {
    return res.status(403).json({ error: "Permission denied" });
  }

  // Check if artwork has active auctions
  const hasActiveAuctions = await auctionService.hasActiveAuctions(id);
  if (hasActiveAuctions) {
    return res.status(400).json({
      error: "Cannot delete artwork with active auctions",
    });
  }

  await auctionService.deleteArtwork(id, userId);
  res.status(204).end();
}

export default withApiMiddleware(handler, {
  requireAuth: false, // Auth checking happens in individual handlers
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
});
