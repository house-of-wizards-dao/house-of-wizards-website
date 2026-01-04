import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Query the table for all tokens with minted = true
    const { data, error } = await supabase
      .from(tableNames.WIZZY_PFP_BY_SHADOWS)
      .select("id")
      .eq("minted", true);

    if (error) {
      logger.error("Supabase query error", { error });
      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Extract just the IDs from the results
    const mintedIds = data?.map((row) => row.id) || [];

    // Return the list of minted IDs with cache headers
    return NextResponse.json(
      { ids: mintedIds },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes
        },
      },
    );
  } catch (error: any) {
    logger.error("API error in minted endpoint", { error });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}

