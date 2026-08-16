import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { tableNames } from "@/config/supabase";
import { isAuthError, requireCMSUser } from "@/lib/cms-auth";
import { logger } from "@/lib/logger";
import { getSupabaseClient } from "@/lib/supabase";
import type { CreateDocumentInput, DocumentItem } from "@/types/cms";

const VALID_STATUSES = ["draft", "published"] as const;

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
    .from(tableNames.DOCUMENTS)
    .select("*")
    .order("category_order", { ascending: true })
    .order("category", { ascending: true })
    .order("date", { ascending: false })
    .order("id", { ascending: false });

  if (user.role === "editor") query = query.eq("author_id", user.id);

  const { data, error } = await query;
  if (error) {
    logger.error("Error fetching CMS documents", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }

  return NextResponse.json({ documents: data as DocumentItem[] });
};

export const POST = async (request: NextRequest) => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  let body: CreateDocumentInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!body.category?.trim()) {
    return NextResponse.json(
      { error: "category is required" },
      { status: 400 },
    );
  }
  if (!Number.isInteger(body.category_order) || body.category_order < 0) {
    return NextResponse.json(
      { error: "category_order must be a non-negative integer" },
      { status: 400 },
    );
  }
  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (!body.author?.trim()) {
    return NextResponse.json({ error: "author is required" }, { status: 400 });
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.DOCUMENTS)
    .insert({
      title: body.title.trim(),
      category: body.category.trim(),
      category_order: body.category_order,
      text: body.text.trim(),
      author: body.author.trim(),
      author_id: authResult.user.id,
      status: body.status ?? "draft",
      date: body.date ?? now.split("T")[0],
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) {
    logger.error("Error creating document", error);
    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }

  revalidateTag("documents");
  revalidatePath("/documents");

  return NextResponse.json({ document: data as DocumentItem }, { status: 201 });
};
