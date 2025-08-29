import { NextApiRequest, NextApiResponse } from "next";
import createApiHandler from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const auctionService = new AuctionService();
    const watchlist = await auctionService.getUserWatchlist(userId);

    res.status(200).json(watchlist);
  } catch (error) {
    logger.error("Error fetching user watchlist", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default createApiHandler(handler, {
  auth: { required: true },
  rateLimit: {
    maxRequests: 100,
    windowMs: 5 * 60 * 1000,
  },
});
