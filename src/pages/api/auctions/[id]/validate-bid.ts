import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { logger } from "@/lib/logger";
import "@/types/api";

const validateBidQuerySchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid auction ID" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const { amount } = validateBidQuerySchema.parse(req.query);

    const auctionService = new AuctionService();
    const validation = await auctionService.validateBid(id, amount, userId);

    res.status(200).json(validation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: error.errors,
      });
    }

    logger.error("Error validating bid", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default withApiMiddleware(handler, {
  auth: { required: true },
  rateLimit: {
    maxRequests: 60, // Allow frequent validation checks
    windowMs: 1 * 60 * 1000, // 1 minute
  },
});
