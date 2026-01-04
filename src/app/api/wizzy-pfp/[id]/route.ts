import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import { traits } from "@/data/traits";
import { logger } from "@/lib/logger";

// In-memory cache for successful responses (indefinite caching)
const responseCache = new Map<number, any>();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          error: "id parameter is required",
        },
        { status: 400 },
      );
    }

    // Parse and validate the ID
    const tokenId = parseInt(id, 10);
    if (isNaN(tokenId) || tokenId < 0) {
      return NextResponse.json(
        {
          error: "id must be a non-negative integer",
        },
        { status: 400 },
      );
    }

    // Check cache first
    const cached = responseCache.get(tokenId);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
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
      if (error.code === "PGRST116") {
        return NextResponse.json(
          {
            error: JSON.stringify(error),
            tokenId: tokenId,
          },
          { status: 404 },
        );
      }

      logger.error("Supabase query error", { error, tokenId });
      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: "NFT token not found or not minted",
          tokenId: tokenId,
        },
        { status: 404 },
      );
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

    // Return the NFT entry
    return NextResponse.json(responseData);
  } catch (error: any) {
    logger.error("API error in wizzy-pfp endpoint", { error });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}

