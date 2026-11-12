import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { artUploadFile, artUploadRequest } from "@/lib/cms-art-uploads";
import { getSupabaseClient } from "@/lib/supabase";

const bucket = "commission-originals";
const lifetime = 2 * 60 * 60 * 1000;
const receiptSchema = z.object({
  address: z.string(),
  kind: z.enum(["artists", "artworks"]),
  id: z.string().uuid().optional(),
  expires: z.number(),
  files: z
    .array(
      artUploadFile.extend({ path: z.string().startsWith("cms-uploads/") }),
    )
    .min(1)
    .max(32),
});

const signature = (payload: string) => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Upload signing is not configured");
  return createHmac("sha256", secret)
    .update(`cms-art-upload:${payload}`)
    .digest();
};

export const prepareArtUploads = async (raw: unknown, address: string) => {
  const input = artUploadRequest.parse(raw);
  const files = input.files.map((file) => ({
    ...file,
    path: `cms-uploads/${randomUUID()}`,
  }));
  const expires = Date.now() + lifetime;
  const payload = Buffer.from(
    JSON.stringify({ ...input, files, address, expires }),
  ).toString("base64url");
  const receipt = `${payload}.${signature(payload).toString("base64url")}`;
  const db = getSupabaseClient();
  // Schedule cleanup after the signed URLs expire, including abandoned uploads.
  // The extra hour lets an in-flight save finish before its staging files expire.
  const { error: cleanupError } = await db
    .from("commission_storage_cleanup")
    .upsert(
      files.map((file) => ({
        bucket_id: bucket,
        object_path: file.path,
        created_at: new Date(expires + 60 * 60 * 1000).toISOString(),
      })),
      { onConflict: "bucket_id,object_path" },
    );
  if (cleanupError) throw new Error("Could not prepare upload cleanup");
  const uploads = [];
  for (const file of files) {
    const { data, error } = await db.storage
      .from(bucket)
      .createSignedUploadUrl(file.path, { upsert: false });
    if (error || !data) throw new Error("Could not prepare file upload");
    uploads.push({ signedUrl: data.signedUrl });
  }
  return { receipt, uploads };
};

export class ArtUploadError extends Error {}

/** Only signed, editor-bound staging paths may be fetched with the service key. */
export const restoreArtUploads = async (
  form: FormData,
  address: string,
  kind: "artists" | "artworks",
  id?: string,
) => {
  const token = form.get("uploads");
  if (token === null) return;
  if (typeof token !== "string" || token.length > 64_000)
    throw new ArtUploadError("Invalid upload receipt");
  const [payload, mac, extra] = token.split(".");
  if (!payload || !mac || extra !== undefined)
    throw new ArtUploadError("Invalid upload receipt");
  const expected = signature(payload);
  const actual = Buffer.from(mac, "base64url");
  if (
    actual.length !== expected.length ||
    !timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected))
  )
    throw new ArtUploadError("Invalid upload receipt");
  const receipt = receiptSchema.parse(
    JSON.parse(Buffer.from(payload, "base64url").toString("utf8")),
  );
  if (receipt.address !== address || receipt.kind !== kind || receipt.id !== id)
    throw new ArtUploadError("The uploads belong to a different edit");
  if (receipt.expires <= Date.now())
    throw new ArtUploadError("The uploads expired. Please save again.");
  artUploadRequest.parse(receipt);
  if (Array.from(form.values()).some((value) => typeof value !== "string"))
    throw new ArtUploadError("Do not mix direct and form uploads");

  const storage = getSupabaseClient().storage.from(bucket);
  for (const file of receipt.files) {
    // Reject unexpected size/type before buffering the object in server memory.
    const { data: info, error: infoError } = await storage.info(file.path);
    if (infoError || !info)
      throw new ArtUploadError(
        `Could not read ${file.name}. Please save again.`,
      );
    if (info.size !== file.size || info.contentType !== file.type)
      throw new ArtUploadError(`The uploaded file does not match ${file.name}`);
    const { data, error } = await storage.download(file.path);
    if (error || !data)
      throw new ArtUploadError(
        `Could not read ${file.name}. Please save again.`,
      );
    if (data.size !== file.size || data.type !== file.type)
      throw new ArtUploadError(`The uploaded file does not match ${file.name}`);
    // FormData creates a File without relying on Node's global File constructor.
    form.append(file.field, data, file.name);
  }
  form.delete("uploads");
};
