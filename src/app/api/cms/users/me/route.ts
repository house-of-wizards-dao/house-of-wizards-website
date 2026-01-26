/**
 * GET /api/cms/users/me
 *
 * Returns the current user's CMS profile.
 * Returns null data if authenticated but not a CMS user.
 */
import { NextResponse } from "next/server";
import { getSessionAddress, getCMSUserByAddress } from "@/lib/cms-auth";

export const GET = async () => {
  const address = await getSessionAddress();

  if (!address) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await getCMSUserByAddress(address);

  return NextResponse.json({ user, address });
};
