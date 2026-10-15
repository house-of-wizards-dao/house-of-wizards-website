import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseClient } from "@/lib/supabase";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const fileId = new URL(request.url).searchParams.get("file");
  if (
    !z.string().uuid().safeParse(id).success ||
    !z.string().uuid().safeParse(fileId).success
  )
    return NextResponse.json(
      { error: "Invalid artwork or file." },
      { status: 400 },
    );
  const db = getSupabaseClient();
  const { data, error } = await db
    .from("commission_artwork_files")
    .select("bucket_id,object_path,original_filename")
    .eq("artwork_id", id)
    .eq("id", fileId)
    .eq("variant", "original")
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Download unavailable." },
      { status: 503 },
    );
  const parsed = z
    .object({
      bucket_id: z.string(),
      object_path: z.string(),
      original_filename: z.string(),
    })
    .safeParse(data);
  if (!parsed.success)
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  const file = parsed.data;
  const signed = await db.storage
    .from(file.bucket_id)
    .createSignedUrl(file.object_path, 60, {
      download: file.original_filename,
    });
  if (signed.error)
    return NextResponse.json(
      { error: "Download unavailable." },
      { status: 503 },
    );
  return NextResponse.redirect(signed.data.signedUrl, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
