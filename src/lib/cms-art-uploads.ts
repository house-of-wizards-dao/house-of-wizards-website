import { z } from "zod";
import { validateArtUpload } from "@/lib/cms-art-validation";

export const artUploadFile = z.object({
  field: z.enum(["originals", "photo", "poster", "web_preview"]),
  name: z.string().min(1).max(255),
  type: z.string(),
  size: z.number().int().positive(),
});

export const artUploadRequest = z
  .object({
    kind: z.enum(["artists", "artworks"]),
    id: z.string().uuid().optional(),
    files: z.array(artUploadFile).min(1).max(32),
  })
  .superRefine(({ kind, files }, ctx) => {
    const issue = (message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    if (files.reduce((total, file) => total + file.size, 0) > 120 * 1024 * 1024)
      issue("Upload no more than 120 MB at once");
    for (const file of files) {
      if ((kind === "artists") !== (file.field === "photo"))
        issue("Invalid file field for this entry");
      const error = validateArtUpload(
        file,
        file.field === "photo" || file.field === "poster",
      );
      if (error) issue(error);
      if (
        file.field === "web_preview" &&
        !file.type.startsWith("video/") &&
        !file.type.startsWith("audio/")
      )
        issue("Web preview must be audio or video");
    }
    for (const field of ["originals", "photo", "poster", "web_preview"]) {
      const limit = field === "originals" ? 30 : 1;
      if (files.filter((file) => file.field === field).length > limit)
        issue(`Upload no more than ${limit} ${field} files at once`);
    }
  });

export const artUploadResponse = z.object({
  receipt: z.string(),
  uploads: z.array(z.object({ signedUrl: z.string().url() })),
});
