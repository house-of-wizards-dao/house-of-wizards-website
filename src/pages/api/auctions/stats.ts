import { NextApiRequest, NextApiResponse } from "next";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { logger } from "@/lib/logger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auctionService = new AuctionService();
    const stats = await auctionService.getAuctionStats();

    res.status(200).json(stats);
  } catch (error) {
    logger.error("Error fetching auction stats", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default withApiMiddleware(handler, {
  requireAuth: false, // Public stats
  rateLimit: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100,
  },
});
