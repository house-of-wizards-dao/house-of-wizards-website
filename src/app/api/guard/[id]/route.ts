import { NextRequest, NextResponse } from "next/server";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=31536000, immutable",
} as const;

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  const params = await context.params;
  const { id } = params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "id parameter is required" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      name: "Guard Pledge",
      description:
        "Placeholder metadata for the Guard experience. Replace with final copy and media URIs before mainnet.",
      image: "https://example.com/guard/placeholder.png",
      animation_url: "https://example.com/guard/placeholder.webm",
      external_url: "https://example.com/guard",
      attributes: [
        {
          trait_type: "Affiliation",
          value: "Guard of the Puppet and the Goat",
        },
        { trait_type: "Faction", value: getFaction(id) },
      ],
    },
    // { headers: CACHE_HEADERS },
  );
};

const getFaction = (id: string) => {
  const shield = warriorsWithTraitsMap[id].shield;
  if (shield === 452) {
    return "Goat Shield";
  } else if (shield === 448) {
    return "Puppet Shield";
  } else {
    return "Other";
  }
};
