/**
 * GET /api/cms/users/me
 *
 * Returns the current user's CMS profile.
 * Returns null data if authenticated but not a CMS user.
 */
import { NextResponse } from "next/server";
import { getSessionAddress, getCMSUserByAddress } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
} as const;

export const GET = async () => {
  const address = await getSessionAddress();

  if (!address) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const user = await getCMSUserByAddress(address);

  return NextResponse.json({ user, address }, { headers: noStoreHeaders });
};
