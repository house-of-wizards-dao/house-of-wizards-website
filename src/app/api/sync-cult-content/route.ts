import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { fetchCultContent } from "@/lib/cult-content";
import { isAuthError, requireAdmin } from "@/lib/cms-auth";

export const POST = async () => {
  const authResult = await requireAdmin();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const supabase = getSupabaseClient();

  try {
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
