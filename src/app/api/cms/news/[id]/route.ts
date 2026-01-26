/**
 * CMS News Item API
 *
 * GET /api/cms/news/[id] - Get single news item
 * PATCH /api/cms/news/[id] - Update news item (author or admin)
 * DELETE /api/cms/news/[id] - Delete news item (author or admin)
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import {
  requireCMSUser,
  isAuthError,
  canEditNews,
  canDeleteNews,
} from "@/lib/cms-auth";
import { UpdateNewsInput, NewsItem } from "@/types/cms";

type RouteParams = {
  params: Promise<{ id: string }>;
};

const getNewsItem = async (id: number): Promise<NewsItem | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as NewsItem;
};

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { id } = await params;
  const newsId = parseInt(id, 10);

  if (isNaN(newsId)) {
    return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
  }

  const newsItem = await getNewsItem(newsId);
  if (!newsItem) {
    return NextResponse.json({ error: "News item not found" }, { status: 404 });
  }

  const { user } = authResult;

  // Editors can only view their own posts
  if (user.role === "editor" && newsItem.author_id !== user.id) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ news: newsItem });
};

export const PATCH = async (request: NextRequest, { params }: RouteParams) => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { id } = await params;
  const newsId = parseInt(id, 10);

  if (isNaN(newsId)) {
    return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
  }

  const newsItem = await getNewsItem(newsId);
  if (!newsItem) {
    return NextResponse.json({ error: "News item not found" }, { status: 404 });
  }

  const { user } = authResult;

  if (!canEditNews(user, newsItem)) {
    return NextResponse.json(
      { error: "Not authorized to edit this news item" },
      { status: 403 },
    );
  }

  let body: UpdateNewsInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.text !== undefined) updates.text = body.text;
  if (body.title !== undefined) updates.title = body.title;
  if (body.author !== undefined) updates.author = body.author;
  if (body.highlight !== undefined) updates.highlight = body.highlight;
  if (body.date !== undefined) updates.date = body.date;

  if (body.status !== undefined) {
    if (!["draft", "published"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'draft' or 'published'" },
        { status: 400 },
      );
    }
    updates.status = body.status;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .update(updates)
    .eq("id", newsId)
    .select()
    .single();

  if (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 },
    );
  }

  return NextResponse.json({ news: data as NewsItem });
};

export const DELETE = async (
  _request: NextRequest,
  { params }: RouteParams,
) => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { id } = await params;
  const newsId = parseInt(id, 10);

  if (isNaN(newsId)) {
    return NextResponse.json({ error: "Invalid news ID" }, { status: 400 });
  }

  const newsItem = await getNewsItem(newsId);
  if (!newsItem) {
    return NextResponse.json({ error: "News item not found" }, { status: 404 });
  }

  const { user } = authResult;

  if (!canDeleteNews(user, newsItem)) {
    return NextResponse.json(
      { error: "Not authorized to delete this news item" },
      { status: 403 },
    );
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from(tableNames.CULT_CONTENT_CHRONICLE)
    .delete()
    .eq("id", newsId);

  if (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
};
