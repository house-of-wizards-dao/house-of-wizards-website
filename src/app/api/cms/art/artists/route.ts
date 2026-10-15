import { NextRequest } from "next/server";
import { artCMS } from "@/lib/server/cms-art";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = (request: NextRequest) => artCMS("artist", "list")(request);
export const POST = (request: NextRequest) => artCMS("artist", "save")(request);
