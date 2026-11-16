import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCMSUser, isAuthError } from "@/lib/cms-auth";
import { prepareArtUploads } from "@/lib/server/cms-art-uploads";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  try {
    const auth = await requireCMSUser();
    if (isAuthError(auth))
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin)
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 },
      );
    const body: unknown = await request.json();
    const result = await prepareArtUploads(body, auth.address);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return NextResponse.json(
        {
          error:
            error instanceof z.ZodError
              ? error.issues.map((issue) => issue.message).join("; ")
              : "Invalid upload request",
        },
        { status: 400 },
      );
    logger.error("Could not prepare art upload", error);
    return NextResponse.json(
      { error: "Could not prepare the upload. Please retry." },
      { status: 502 },
    );
  }
};
