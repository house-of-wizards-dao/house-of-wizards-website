import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { z } from "zod";
import { withApiMiddleware } from "@/lib/api-middleware";
import { imageUploadService } from "@/lib/services/image-upload-service";
import { logger } from "@/lib/logger";
import "@/types/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadOptionsSchema = z.object({
  maxWidth: z.coerce.number().min(100).max(4096).optional(),
  maxHeight: z.coerce.number().min(100).max(4096).optional(),
  quality: z.coerce.number().min(0.1).max(1).optional(),
  generateThumbnail: z.coerce.boolean().optional(),
  thumbnailSize: z.coerce.number().min(50).max(800).optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    // Parse multipart form data
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024, // 10MB per file
      maxTotalFileSize: 50 * 1024 * 1024, // 50MB total
      filter: (part) => {
        return part.mimetype?.startsWith("image/") || false;
      },
    });

    const [fields, files] = await form.parse(req);

    // Extract files array
    const imageFiles = Object.values(files).flat().filter(Boolean);

    if (imageFiles.length === 0) {
      return res.status(400).json({ error: "No valid image files provided" });
    }

    // Validate upload options
    const options = uploadOptionsSchema.parse({
      maxWidth: fields.maxWidth?.[0],
      maxHeight: fields.maxHeight?.[0],
      quality: fields.quality?.[0],
      generateThumbnail: fields.generateThumbnail?.[0],
      thumbnailSize: fields.thumbnailSize?.[0],
    });

    // Upload images
    const validImageFiles = imageFiles.filter((file) => file !== undefined) as unknown as File[];
    const results = await imageUploadService.uploadArtworkImages(
      validImageFiles,
      userId,
      options,
    );

    logger.info("Successfully uploaded artwork images", {
      userId,
      fileCount: imageFiles.length,
      results: results.map((r) => ({ url: r.url, size: r.file_size })),
    });

    res.status(200).json({
      success: true,
      images: results,
      count: results.length,
    });
  } catch (error) {
    logger.error("Error uploading artwork images", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid upload options",
        details: error.errors,
      });
    }

    return res.status(500).json({
      error: "Failed to upload images",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default withApiMiddleware(handler, {
  auth: { required: true },
  rateLimit: {
    maxRequests: 20, // Limit file uploads
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
});
