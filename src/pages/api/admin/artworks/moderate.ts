import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api-middleware";
import { AuctionService } from "@/lib/services/auction-service";
import { logger } from "@/lib/logger";

const artworkModerationSchema = z.object({
  artwork_id: z.string().uuid("Invalid artwork ID"),
  action: z.enum(["approve", "reject", "flag"]),
  reason: z.string().max(500).optional(),
});

const bulkArtworkActionSchema = z.object({
  artwork_ids: z.array(z.string().uuid()).min(1).max(50),
  action: z.enum(["approve", "reject", "flag"]),
  reason: z.string().max(500).optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId || (userRole !== "admin" && userRole !== "moderator")) {
    return res
      .status(403)
      .json({ error: "Admin or moderator access required" });
  }

  try {
    const auctionService = new AuctionService();

    // Check if this is a bulk action
    if (Array.isArray(req.body.artwork_ids)) {
      return await handleBulkAction(req, res, auctionService, userId);
    } else {
      return await handleSingleAction(req, res, auctionService, userId);
    }
  } catch (error) {
    logger.error("Error in artwork moderation API", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function handleSingleAction(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  userId: string,
) {
  try {
    const validatedData = artworkModerationSchema.parse(req.body);
    const result = await auctionService.moderateArtwork(validatedData, userId);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid moderation data",
        details: error.errors,
      });
    }
    throw error;
  }
}

async function handleBulkAction(
  req: NextApiRequest,
  res: NextApiResponse,
  auctionService: AuctionService,
  userId: string,
) {
  try {
    const validatedData = bulkArtworkActionSchema.parse(req.body);
    const result = await auctionService.bulkModerateArtworks(
      validatedData,
      userId,
    );

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid bulk action data",
        details: error.errors,
      });
    }
    throw error;
  }
}

export default withApiMiddleware(handler, {
  auth: {
    required: true,
    roles: ["admin", "moderator"],
  },
  rateLimit: {
    maxRequests: 50,
    windowMs: 15 * 60 * 1000,
  },
});
