import { NextApiRequest, NextApiResponse } from "next";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid auction ID" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const auctionService = new AuctionService();

  try {
    switch (req.method) {
      case "POST":
        return await handleAddToWatchlist(req, res, auctionService, id, userId);
      case "DELETE":
        return await handleRemoveFromWatchlist(
          req,
          res,
          auctionService,
          id,
          userId,
        );
      default:
        res.setHeader("Allow", ["POST", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    logger.error("Error in auction watchlist API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleAddToWatchlist(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  auctionId: string,
  userId: string,
) {
  try {
    const watchlistItem = await auctionService.addToWatchlist(
      userId,
      auctionId,
    );
    res.status(201).json(watchlistItem);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: "Auction not found" });
      }
      if (error.message.includes("already in watchlist")) {
        return res.status(409).json({ error: "Auction already in watchlist" });
      }
    }
    throw error;
  }
}

async function handleRemoveFromWatchlist(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  auctionId: string,
  userId: string,
) {
  await auctionService.removeFromWatchlist(userId, auctionId);
  res.status(204).end();
}

export default withApiMiddleware(handler, {
  requireAuth: true,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
});
