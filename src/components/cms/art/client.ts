import { z } from "zod";
import { cmsArtistSchema, cmsArtworkSchema } from "@/types/cms-art";
import { artUploadRequest, artUploadResponse } from "@/lib/cms-art-uploads";
type Kind = "artists" | "artworks";
export const fetchArtEntries = async (kind: Kind) => {
  const response = await fetch(`/api/cms/art/${kind}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load the art catalog");
  const body: unknown = await response.json();
  return z
    .object({
      entries: z.array(kind === "artists" ? cmsArtistSchema : cmsArtworkSchema),
    })
    .parse(body).entries;
};
export const saveEntry = async (
  kind: Kind,
  id: string | undefined,
  data: FormData,
) => {
  const form = new FormData();
  const files: { field: string; file: File }[] = [];
  for (const [field, value] of data.entries()) {
    if (typeof value === "string") form.append(field, value);
    else files.push({ field, file: value });
  }
  if (files.length) {
    const input = artUploadRequest.safeParse({
      kind,
      id,
      files: files.map(({ field, file }) => ({
        field,
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    });
    if (!input.success)
      throw new Error(
        input.error.issues.map((issue) => issue.message).join("; "),
      );
    const prepared = await fetch("/api/cms/art/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input.data),
    });
    const body: unknown = await prepared.json().catch(() => null);
    if (!prepared.ok) {
      const failure = z.object({ error: z.string() }).safeParse(body);
      throw new Error(
        failure.success ? failure.data.error : "Could not prepare the upload",
      );
    }
    const result = artUploadResponse.parse(body);
    if (result.uploads.length !== files.length)
      throw new Error("Could not prepare all files. Please retry.");
    for (const [index, { file }] of files.entries()) {
      // File bytes go straight to private storage, bypassing the API body limit.
      const response = await fetch(result.uploads[index].signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
        credentials: "omit",
      });
      if (!response.ok)
        throw new Error(`Could not upload ${file.name}. Please retry.`);
    }
    form.set("uploads", result.receipt);
  }
  const response = await fetch(`/api/cms/art/${kind}${id ? `/${id}` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: form,
  });
  if (response.status === 413)
    throw new Error(
      "The upload is too large for this server. Try a smaller file or fewer comic pages.",
    );
  const body: unknown = await response.json().catch(() => null);
  const parsed = z
    .object({ error: z.string().optional(), id: z.string().optional() })
    .safeParse(body);
  if (!parsed.success)
    throw new Error("The server could not process the upload. Please retry.");
  const result = parsed.data;
  if (!response.ok)
    throw new Error(result.error ?? "The entry could not be saved");
};
