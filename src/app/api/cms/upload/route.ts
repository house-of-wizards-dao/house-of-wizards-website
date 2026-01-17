/**
 * CMS Media Upload API
 *
 * POST /api/cms/upload - Upload image, audio, or video to Supabase storage
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { requireCMSUser, isAuthError } from "@/lib/cms-auth";

const BUCKET_NAME = "cult-content-chronicle";

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const ALL_ALLOWED_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_AUDIO_TYPES,
  ...ALLOWED_VIDEO_TYPES,
];

// Max file sizes (in bytes)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function getMediaType(
  mimeType: string,
): "image" | "audio" | "video" | "unknown" {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return "image";
  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) return "audio";
  if (ALLOWED_VIDEO_TYPES.includes(mimeType)) return "video";
  return "unknown";
}

function getMaxSize(
  mediaType: "image" | "audio" | "video" | "unknown",
): number {
  switch (mediaType) {
    case "image":
      return MAX_IMAGE_SIZE;
    case "audio":
      return MAX_AUDIO_SIZE;
    case "video":
      return MAX_VIDEO_SIZE;
    default:
      return 0;
  }
}

function generateFileName(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "bin";
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace special chars
    .substring(0, 50); // Limit length

  return `${userId}/${timestamp}-${sanitizedName}-${randomSuffix}.${extension}`;
}

export async function POST(request: NextRequest) {
  // Verify CMS access
  const authResult = await requireCMSUser();
  if (isAuthError(authResult)) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status },
    );
  }

  const { user } = authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Allowed types: images (jpg, png, gif, webp, svg), audio (mp3, wav, ogg, m4a), video (mp4, webm, ogg)`,
        },
        { status: 400 },
      );
    }

    const mediaType = getMediaType(file.type);
    const maxSize = getMaxSize(mediaType);

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        {
          error: `File too large. Maximum size for ${mediaType} is ${maxSizeMB}MB`,
        },
        { status: 400 },
      );
    }

    // Generate unique filename
    const fileName = generateFileName(file.name, user.id);

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    // Generate markdown based on media type
    let markdown: string;
    switch (mediaType) {
      case "image":
        markdown = `![${file.name}](${publicUrl})`;
        break;
      case "audio":
        markdown = `<audio controls src="${publicUrl}"></audio>`;
        break;
      case "video":
        markdown = `<video controls src="${publicUrl}"></video>`;
        break;
      default:
        markdown = `[${file.name}](${publicUrl})`;
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: data.path,
      mediaType,
      markdown,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 },
    );
  }
}
