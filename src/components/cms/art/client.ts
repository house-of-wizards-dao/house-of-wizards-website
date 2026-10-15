import { z } from "zod";
import { cmsArtistSchema, cmsArtworkSchema } from "@/types/cms-art";
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
  const response = await fetch(`/api/cms/art/${kind}${id ? `/${id}` : ""}`, {
    method: id ? "PATCH" : "POST",
    body: data,
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
