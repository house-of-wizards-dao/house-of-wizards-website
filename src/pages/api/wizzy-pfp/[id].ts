import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import { traits } from "@/data/traits";
import { logger } from "@/lib/logger";

// In-memory cache for successful responses (indefinite caching)
const responseCache = new Map<number, any>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "id parameter is required",
      });
    }

    // Parse and validate the ID
    const tokenId = parseInt(id, 10);
    if (isNaN(tokenId) || tokenId < 0) {
      return res.status(400).json({
        error: "id must be a non-negative integer",
      });
    }

    // Check cache first
    const cached = responseCache.get(tokenId);
    if (cached) {
      // Set cache headers for HTTP caching (indefinite)
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.status(200).json(cached);
    }

    const supabase = getSupabaseClient();

    // Query the table for the token with minted = true
    const { data, error } = await supabase
      .from(tableNames.WIZZY_PFP_BY_SHADOWS)
      .select("*")
      .eq("id", tokenId)
      .eq("minted", true)
      .single();

    if (error) {
      // If no rows found, Supabase returns an error
      if (error.code === "PGRST116") {
        return res.status(404).json({
          //   error: "1 NFT token not found or not minted",
          error: JSON.stringify(error),
          tokenId: tokenId,
        });
      }

      logger.error("Supabase query error", { error, tokenId });
      return res.status(500).json({
        error: "Database error",
        details: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        error: "2 NFT token not found or not minted",
        tokenId: tokenId,
      });
    }

    const wizard = wizardsWithTraitsMap[id];

    const attributes: Record<string, string> = {};
    Object.entries(wizard).forEach(([key, value]) => {
      if (key === "idx") return;
      attributes[key] =
        traits.find((trait) => trait.idx === value)?.displayName || "";
    });

    // Build response data
    const responseData = {
      image: `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/wizards-pfp-derivative/${data.image_url}.png`,
      name: wizard.name,
      attributes: attributes,
    };

    // Cache the successful response indefinitely
    responseCache.set(tokenId, responseData);

    // Set cache headers for HTTP caching (indefinite - 1 year with immutable flag)
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // Return the NFT entry
    return res.status(200).json(responseData);
  } catch (error: any) {
    logger.error("API error in wizzy-pfp endpoint", { error });

    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
}
