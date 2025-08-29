import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { updateAuctionSchema } from "@/lib/validation-schemas";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid auction ID" });
  }

  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "GET":
        return await handleGetAuction(req, res, auctionService, id);
      case "PUT":
        return await handleUpdateAuction(req, res, auctionService, id);
      case "DELETE":
        return await handleDeleteAuction(req, res, auctionService, id);
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    logger.error("Error in auction API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleGetAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  id: string,
) {
  const auction = await auctionService.getAuction(id);

  if (!auction) {
    return res.status(404).json({ error: "Auction not found" });
  }

  // Track auction view if user is authenticated
  if (req.user?.id && req.user.id !== auction.created_by) {
    // Log view asynchronously without blocking response
    auctionService
      .trackAuctionView(
        id,
        req.user.id,
        req.ip || "",
        req.headers["user-agent"],
      )
      .catch((error) => logger.error("Error tracking auction view", error));
  }

  res.status(200).json(auction);
}

async function handleUpdateAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  id: string,
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user owns the auction or is admin
  const existingAuction = await auctionService.getAuction(id);
  if (!existingAuction) {
    return res.status(404).json({ error: "Auction not found" });
  }

  const isOwner = existingAuction.created_by === userId;
  const isAdmin = req.user?.role === "admin" || req.user?.role === "moderator";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "Permission denied" });
  }

  try {
    const validatedData = updateAuctionSchema.parse(req.body);
    const auction = await auctionService.updateAuction(
      id,
      validatedData,
      userId,
    );

    res.status(200).json(auction);
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

async function handleDeleteAuction(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  id: string,
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Check if user owns the auction or is admin
  const existingAuction = await auctionService.getAuction(id);
  if (!existingAuction) {
    return res.status(404).json({ error: "Auction not found" });
  }

  const isOwner = existingAuction.created_by === userId;
  const isAdmin = req.user?.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "Permission denied" });
  }

  // Prevent deletion of active auctions with bids
  if (existingAuction.status === "active" && existingAuction.total_bids > 0) {
    return res.status(400).json({
      error:
        "Cannot delete active auction with bids. Cancel the auction instead.",
    });
  }

  await auctionService.deleteAuction(id, userId);
  res.status(204).end();
}

export default withApiMiddleware(handler, {
  requireAuth: false, // Auth checking happens in individual handlers
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
});
