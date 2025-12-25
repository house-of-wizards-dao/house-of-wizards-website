import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { logger } from "@/lib/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("@@@ minted request", req.method);
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = getSupabaseClient();

    // Query the table for all tokens with minted = true
    const { data, error } = await supabase
      .from(tableNames.WIZZY_PFP_BY_SHADOWS)
      .select("id")
      .eq("minted", true);

    console.log("@@@ minted data", data);
    if (error) {
      logger.error("Supabase query error", { error });
      return res.status(500).json({
        error: "Database error",
        details: error.message,
      });
    }

    // Extract just the IDs from the results
    const mintedIds = data?.map((row) => row.id) || [];

    // Set cache headers for HTTP caching (shorter cache since new mints can happen)
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 minutes

    // Return the list of minted IDs
    return res.status(200).json({ ids: mintedIds });
  } catch (error: any) {
    logger.error("API error in minted endpoint", { error });

    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
}
