import { NextResponse } from "next/server";

// Fixed upstream and strict path validation: this is an image/atlas proxy, not
// an arbitrary URL fetcher. Same-origin loading also works in WebGL with CORS.
export const GET = async (
  _request: Request,
  context: {
    params: Promise<{ family: string; tokenId: string; file: string }>;
  },
) => {
  const { family, tokenId, file } = await context.params;
  if (
    !["wizards", "souls", "warriors"].includes(family) ||
    !/^(0|[1-9]\d{0,4})$/.test(tokenId) ||
    !["spritesheet.png", "spritesheet.json"].includes(file)
  )
    return NextResponse.json({ error: "Unknown sprite" }, { status: 400 });
  try {
    const response = await fetch(
      `https://www.forgottenrunes.com/api/art/${family}/${tokenId}/${file}`,
      { next: { revalidate: 86_400 }, signal: AbortSignal.timeout(15_000) },
    );
    if (!response.ok) throw new Error("Sprite unavailable");
    const body = await response.arrayBuffer();
    if (body.byteLength > 2_000_000) throw new Error("Sprite too large");
    return new Response(body, {
      headers: {
        "Content-Type": file.endsWith("png") ? "image/png" : "application/json",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "The official sprite is temporarily unavailable." },
      { status: 502 },
    );
  }
};
