import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { placeBidSchema } from "@/lib/validation-schemas";
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
        return await handleGetAuctionBids(req, res, auctionService, id);
      case "POST":
        return await handlePlaceBid(req, res, auctionService, id);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    logger.error("Error in auction bids API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleGetAuctionBids(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  auctionId: string,
) {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 50); // Max 50 bids per request

  try {
    const result = await auctionService.getAuctionBids(auctionId, {
      page,
      limit,
    });
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return res.status(404).json({ error: "Auction not found" });
    }
    throw error;
  }
}

async function handlePlaceBid(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  auctionId: string,
) {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const validatedData = placeBidSchema.parse(req.body);

    // Get client IP and user agent for security
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) ||
      (req.headers["x-real-ip"] as string) ||
      req.connection.remoteAddress ||
      req.ip ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    const bid = await auctionService.placeBid(
      auctionId,
      validatedData,
      userId,
      ipAddress,
      userAgent,
    );

    res.status(201).json(bid);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid bid data",
        details: error.errors,
      });
    }

    if (error instanceof Error) {
      // Handle specific auction/bidding errors
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: "Auction not found" });
      }
      if (error.message.includes("not active")) {
        return res.status(400).json({ error: "Auction is not active" });
      }
      if (error.message.includes("ended")) {
        return res.status(400).json({ error: "Auction has ended" });
      }
      if (error.message.includes("not started")) {
        return res.status(400).json({ error: "Auction has not started yet" });
      }
      if (error.message.includes("must be at least")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message.includes("your own auction")) {
        return res
          .status(403)
          .json({ error: "Cannot bid on your own auction" });
      }
      if (error.message.includes("highest bidder")) {
        return res
          .status(400)
          .json({ error: "You are already the highest bidder" });
      }
      if (error.message.includes("Too many bids")) {
        return res.status(429).json({
          error: "Rate limit exceeded. Please wait before bidding again.",
        });
      }
    }

    throw error;
  }
}

export default withApiMiddleware(handler, {
  auth: { required: false }, // GET doesn't require auth, POST will check in handler
  rateLimit: {
    maxRequests: 30, // More restrictive for bidding
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
});
