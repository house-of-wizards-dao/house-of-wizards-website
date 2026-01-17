/**
 * GET /api/cms/users/me
 *
 * Returns the current user's CMS profile.
 * Returns null data if authenticated but not a CMS user.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getSessionAddress, getCMSUserByAddress } from "@/lib/cms-auth";

export async function GET() {
  // Debug: log the full session
  const session = await getServerSession(authOptions);
  console.log("CMS /me - Full session:", JSON.stringify(session, null, 2));

  const address = await getSessionAddress();
  console.log("CMS /me - Extracted address:", address);

  if (!address) {
    return NextResponse.json(
      { error: "Not authenticated", debug: { session } },
      { status: 401 },
    );
  }

  const user = await getCMSUserByAddress(address);
  console.log("CMS /me - User from DB:", user);

  return NextResponse.json({ user, address });
}
