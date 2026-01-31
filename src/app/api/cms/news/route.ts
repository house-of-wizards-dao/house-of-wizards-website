/**
 * CMS News API
 *
 * GET /api/cms/news - List news items (admin: all, editor: own only)
 * POST /api/cms/news - Create news item (editor/admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { requireCMSUser, isAuthError } from "@/lib/cms-auth";
import { CreateNewsInput, NewsItem } from "@/types/cms";

export const GET = async () => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { user } = authResult;
  const supabase = getSupabaseClient();

  let query = supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .select("*")
    .order("date", { ascending: false })
    .order("id", { ascending: false });

  // Editors can only see their own posts
  if (user.role === "editor") {
    query = query.eq("author_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 },
    );
  }

  return NextResponse.json({ news: data as NewsItem[] });
};

export const POST = async (request: NextRequest) => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { user } = authResult;

  let body: CreateNewsInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  if (!body.author) {
    return NextResponse.json({ error: "author is required" }, { status: 400 });
  }

  // Validate status if provided
  if (body.status && !["draft", "published"].includes(body.status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'draft' or 'published'" },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .insert({
      text: body.text,
      title: body.title ?? null,
      author: body.author,
      author_id: user.id,
      highlight: body.highlight ?? false,
      status: body.status ?? "draft",
      date: body.date ?? now.split("T")[0],
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 },
    );
  }

  // Invalidate caches so landing page shows fresh data
  revalidateTag("cult-content");
  revalidatePath("/");

  return NextResponse.json({ news: data as NewsItem }, { status: 201 });
};
