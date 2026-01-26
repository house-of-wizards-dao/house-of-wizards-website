/**
 * CMS User by Address API
 *
 * GET /api/cms/users/[address] - Get user by address (admin only)
 * PATCH /api/cms/users/[address] - Update user (admin only)
 * DELETE /api/cms/users/[address] - Delete user (admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { requireAdmin, isAuthError } from "@/lib/cms-auth";
import { UpdateUserInput, User } from "@/types/cms";

type RouteParams = {
  params: Promise<{ address: string }>;
};

export const GET = async (_request: NextRequest, { params }: RouteParams) => {
  const authResult = await requireAdmin();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { address } = await params;
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.USERS)
    .select("*")
    .eq("eth_address", address.toLowerCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: data as User });
};

export const PATCH = async (request: NextRequest, { params }: RouteParams) => {
  const authResult = await requireAdmin();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { address } = await params;

  let body: UpdateUserInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.twitter_handle !== undefined) {
    updates.twitter_handle = body.twitter_handle;
  }
  if (body.role !== undefined) {
    if (!["editor", "admin"].includes(body.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'editor' or 'admin'" },
        { status: 400 },
      );
    }
    updates.role = body.role;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.USERS)
    .update(updates)
    .eq("eth_address", address.toLowerCase())
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: data as User });
};

export const DELETE = async (
  _request: NextRequest,
  { params }: RouteParams,
) => {
  const authResult = await requireAdmin();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { address } = await params;

  // Prevent self-deletion
  if (address.toLowerCase() === authResult.address.toLowerCase()) {
    return NextResponse.json(
      { error: "Cannot delete yourself" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from(tableNames.USERS)
    .delete()
    .eq("eth_address", address.toLowerCase());

  if (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
};
