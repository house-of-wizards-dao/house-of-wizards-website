import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { tableNames } from "@/config/supabase";
import { isAuthError, requireCMSUser } from "@/lib/cms-auth";
import { logger } from "@/lib/logger";
import { getSupabaseClient } from "@/lib/supabase";
import type { DocumentItem, UpdateDocumentInput } from "@/types/cms";

type RouteParams = { params: Promise<{ id: string }> };

const getDocument = async (id: number): Promise<DocumentItem | null> => {
  const { data, error } = await getSupabaseClient()
    .from(tableNames.DOCUMENTS)
    .select("*")
    .eq("id", id)
    .single();
  return error || !data ? null : (data as DocumentItem);
};

const authorizeDocument = async (id: string) => {
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) return { authError: authResult } as const;

  const documentId = Number.parseInt(id, 10);
  if (Number.isNaN(documentId)) return { invalidId: true } as const;

  const document = await getDocument(documentId);
  if (!document) return { notFound: true } as const;
  if (
    authResult.user.role !== "admin" &&
    document.author_id !== authResult.user.id
  ) {
    return { forbidden: true } as const;
  }

  return { document, documentId } as const;
};

const errorResponse = (
  result: Awaited<ReturnType<typeof authorizeDocument>>,
): NextResponse | null => {
  if ("authError" in result && result.authError) {
    return NextResponse.json(
      { error: result.authError.error },
      { status: result.authError.status },
    );
  }
  if ("invalidId" in result) {
    return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
  }
  if ("notFound" in result) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }
  if ("forbidden" in result) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  return null;
};

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const result = await authorizeDocument(id);
  const error = errorResponse(result);
  if (error) return error;

  return NextResponse.json({ document: result.document });
};

export const PATCH = async (request: NextRequest, { params }: RouteParams) => {
  const { id } = await params;
  const result = await authorizeDocument(id);
  const authError = errorResponse(result);
  if (authError) return authError;

  let body: UpdateDocumentInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.title !== undefined && !body.title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (body.category !== undefined && !body.category.trim()) {
    return NextResponse.json(
      { error: "category is required" },
      { status: 400 },
    );
  }
  if (
    body.category_order !== undefined &&
    (!Number.isInteger(body.category_order) || body.category_order < 0)
  ) {
    return NextResponse.json(
      { error: "category_order must be a non-negative integer" },
      { status: 400 },
    );
  }
  if (body.text !== undefined && !body.text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (body.author !== undefined && !body.author.trim()) {
    return NextResponse.json({ error: "author is required" }, { status: 400 });
  }
  if (
    body.status !== undefined &&
    !["draft", "published"].includes(body.status)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updates: Record<string, string | number> = {
    updated_at: new Date().toISOString(),
  };
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.category !== undefined) updates.category = body.category.trim();
  if (body.category_order !== undefined) {
    updates.category_order = body.category_order;
  }
  if (body.text !== undefined) updates.text = body.text.trim();
  if (body.author !== undefined) updates.author = body.author.trim();
  if (body.status !== undefined) updates.status = body.status;
  if (body.date !== undefined) updates.date = body.date;

  const { data, error } = await getSupabaseClient()
    .from(tableNames.DOCUMENTS)
    .update(updates)
    .eq("id", result.documentId)
    .select()
    .single();

  if (error) {
    logger.error("Error updating document", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 },
    );
  }

  revalidateTag("documents");
  revalidatePath("/documents");
  revalidatePath(`/documents/${result.documentId}`);

  return NextResponse.json({ document: data as DocumentItem });
};

export const DELETE = async (
  _request: NextRequest,
  { params }: RouteParams,
) => {
  const { id } = await params;
  const result = await authorizeDocument(id);
  const authError = errorResponse(result);
  if (authError) return authError;

  const { error } = await getSupabaseClient()
    .from(tableNames.DOCUMENTS)
    .delete()
    .eq("id", result.documentId);

  if (error) {
    logger.error("Error deleting document", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 },
    );
  }

  revalidateTag("documents");
  revalidatePath("/documents");

  return NextResponse.json({ success: true });
};
