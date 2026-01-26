/**
 * CMS Users API
 *
 * GET /api/cms/users - List all users (admin only)
 * POST /api/cms/users - Create new user (admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { requireAdmin, isAuthError } from "@/lib/cms-auth";
import { CreateUserInput, User } from "@/types/cms";

export const GET = async () => {
  const authResult = await requireAdmin();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.USERS)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }

  return NextResponse.json({ users: data as User[] });
};

export const POST = async (request: NextRequest) => {
  const authResult = await requireAdmin();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  let body: CreateUserInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.eth_address) {
    return NextResponse.json(
      { error: "eth_address is required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(tableNames.USERS)
    .insert({
      eth_address: body.eth_address.toLowerCase(),
      twitter_handle: body.twitter_handle ?? null,
      role: body.role ?? "editor",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "User with this address already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }

  return NextResponse.json({ user: data as User }, { status: 201 });
};
