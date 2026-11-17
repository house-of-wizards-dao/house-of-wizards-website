import { NextRequest, NextResponse } from "next/server";
import {
  executeCommand,
  explainError,
  getPrisonState,
} from "@/lib/forgotten-prison/controller";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isLocalRequest = (request: NextRequest) => {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.FORGOTTEN_PRISON_LOCAL_ENABLED !== "1"
  )
    return false;
  const host = request.headers.get("host");
  if (!host || !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return false;
  const origin = request.headers.get("origin");
  if (origin && origin !== `http://${host}`) return false;
  return !["cross-site", "same-site"].includes(
    request.headers.get("sec-fetch-site") ?? "",
  );
};

const json = (value: unknown, status = 200) =>
  new NextResponse(
    JSON.stringify(value, (_, v: unknown) =>
      typeof v === "bigint" ? v.toString() : v,
    ),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
// Serialize reads and writes, including reset, so state never mixes pre/post-reset blocks.
let queue = Promise.resolve();
const exclusive = <T>(action: () => Promise<T>) => {
  const result = queue.then(action);
  queue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
};
export const GET = async (request: NextRequest) => {
  if (!isLocalRequest(request)) return json({ error: "Not found" }, 404);
  try {
    return json(await exclusive(getPrisonState));
  } catch (error) {
    return json({ error: explainError(error) }, 503);
  }
};
export const POST = async (request: NextRequest) => {
  if (!isLocalRequest(request)) return json({ error: "Not found" }, 404);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return json({ error: "Expected application/json" }, 415);
  try {
    const raw = await request.text();
    if (raw.length > 8192) return json({ error: "Request too large" }, 413);
    const input: unknown = JSON.parse(raw);
    return json(await exclusive(() => executeCommand(input)));
  } catch (error) {
    return json({ error: explainError(error) }, 400);
  }
};
