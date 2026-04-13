import { NextRequest, NextResponse } from "next/server";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, immutable",
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
      description: `I, ${warriorsWithTraitsMap[id].name}, pledge my blade, my blood, and my undying spirit to the Guard of the Puppet and the Goat. Through scorched peaks and endless night, I shall not waver. My watch begins now and ends only when the last star falls — when the prophecy is fulfilled and the sacred balance is made whole.`,
      image:
        "https://sgypzehngyhcdvtwlwst.supabase.co/storage/v1/object/public/guard/pledge.png",
      attributes: [
        {
          trait_type: "Affiliation",
          value: "Guard of the Puppet and the Goat",
        },
        { trait_type: "Faction", value: getFaction(id) },
      ],
    },
    { headers: CACHE_HEADERS },
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
