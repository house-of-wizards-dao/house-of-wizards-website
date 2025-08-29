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
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50);
    const status = req.query.status as string;

    const auctionService = new AuctionService();
    const result = await auctionService.searchAuctions({
      filters: {
        created_by: userId,
        ...(status && { status: [status as any] }),
      },
      page,
      limit,
      sort_by: "created_at",
      sort_order: "desc",
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error("Error fetching user auctions", error);
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
