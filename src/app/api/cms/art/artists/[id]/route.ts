import { NextRequest } from "next/server";
import { artCMS } from "@/lib/server/cms-art";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
export const GET = (request: NextRequest, context: Context) =>
  artCMS("artist", "get")(request, context);
export const PATCH = (request: NextRequest, context: Context) =>
  artCMS("artist", "save")(request, context);
export const DELETE = (request: NextRequest, context: Context) =>
  artCMS("artist", "delete")(request, context);
