import { NextResponse } from "next/server";
import { asLocalNftCollection } from "@/types/nft-metadata";
import { getLocalNftMetadata } from "@/lib/server/character-metadata";

export const GET = async (
  _request: Request,
  context: { params: Promise<{ collection: string; id: string }> },
) => {
  const params = await context.params;
  const collection = asLocalNftCollection(params.collection);
  if (!collection)
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const data = getLocalNftMetadata(collection, params.id);
  if (!data)
    return NextResponse.json({ error: "Unknown character" }, { status: 404 });
  return NextResponse.json(data, {
    headers: {
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
