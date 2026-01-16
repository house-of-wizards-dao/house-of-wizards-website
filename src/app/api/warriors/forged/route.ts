import { NextResponse } from "next/server";
import { fetchWarriorsWithForgedWeapon } from "@/lib/frwc-graphql";

export async function GET() {
  try {
    const data = await fetchWarriorsWithForgedWeapon();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching warriors:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch warriors",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
