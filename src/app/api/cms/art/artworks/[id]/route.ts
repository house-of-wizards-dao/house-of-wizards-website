import { NextRequest } from "next/server";
import { artCMS } from "@/lib/server/cms-art";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
export const GET = (request: NextRequest, context: Context) =>
  artCMS("artwork", "get")(request, context);
export const PATCH = (request: NextRequest, context: Context) =>
  artCMS("artwork", "save")(request, context);
export const DELETE = (request: NextRequest, context: Context) =>
  artCMS("artwork", "delete")(request, context);
