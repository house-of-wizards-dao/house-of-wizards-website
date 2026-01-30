import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { fetchCultContent } from "@/lib/cult-content";

// Cache response for 1 hour - prevents calling more than once per hour
export const revalidate = 3600;

const WEDNESDAY = 3;

/**
 * Get the most recent Wednesday midnight UTC.
 * If today is Wednesday and it's past midnight, returns today's midnight.
 * Otherwise, returns the previous Wednesday's midnight.
 */
const getMostRecentWednesdayMidnightUTC = (): Date => {
  const now = new Date();
  const currentDay = now.getUTCDay();

  // Calculate days since last Wednesday (0 = today is Wednesday)
  const daysSinceWednesday = (currentDay - WEDNESDAY + 7) % 7;

  const wednesday = new Date(now);
  wednesday.setUTCDate(now.getUTCDate() - daysSinceWednesday);
  wednesday.setUTCHours(0, 0, 0, 0);

  return wednesday;
};

export const GET = async () => {
  const supabase = getSupabaseClient();

  try {
    // Check if a sync has already happened since the last Wednesday midnight UTC
    // const lastWednesday = getMostRecentWednesdayMidnightUTC();

    // const { count, error: countError } = await supabase
    //   .from(tableNames.CULT_CONTENT_CHRONICLE)
    //   .select("*", { count: "exact", head: true })
    //   .gte("created_at", lastWednesday.toISOString());

    // if (countError) {
    //   console.error("Error checking last sync:", countError);
    //   return NextResponse.json(
    //     { error: "Failed to check sync status", details: countError.message },
    //     { status: 500 },
    //   );
    // }

    // if (count && count > 0) {
    //   return NextResponse.json({
    //     success: true,
    //     message: "No-op: sync already completed this week",
    //     skipped: true,
    //     weekStartedAt: lastWednesday.toISOString(),
    //   });
    // }

    // Optional: simple auth via header token
    // const authToken = request.headers.get("x-sync-token");
    // const expectedToken = process.env.CULT_CONTENT_SYNC_TOKEN;

    // if (expectedToken && authToken !== expectedToken) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Fetch and parse the Google Doc
    const items = await fetchCultContent();

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No items found in the document",
        inserted: 0,
      });
    }

    const { data, error } = await supabase
      .from(tableNames.CULT_CONTENT_CHRONICLE)
      .insert(items)
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: "Failed to insert items into database",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Invalidate the cult-content cache so the landing page shows fresh data
    revalidateTag("cult-content");

    return NextResponse.json({
      success: true,
      message: `Synced ${items.length} items`,
      inserted: data?.length ?? items.length,
      date: items[0]?.date,
    });
  } catch (error: unknown) {
    console.error("Sync error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to sync cult content",
        details: message,
      },
      { status: 500 },
    );
  }
};
