import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import formidable, { File } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";
import { getServiceSupabase } from "@/lib/supabase";
import { requireAuth, AuthenticatedUser } from "@/lib/auth";
import {
  createApiHandler,
  sendSuccess,
  ApiValidationError,
  ApiErrorCode,
} from "@/lib/api-middleware";
import { logger } from "@/lib/logger";
import { cacheManager } from "@/lib/cache-manager";

// File type configurations
const FILE_CONFIGS = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    bucket: "files",
    requiresOptimization: true,
  },
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    bucket: "avatars",
    requiresOptimization: true,
    dimensions: { width: 400, height: 400 }, // Square avatars
  },
  talent_avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    bucket: "talent-avatars",
    requiresOptimization: true,
    dimensions: { width: 300, height: 300 },
  },
  document: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ["application/pdf", "text/plain", "application/msword"],
    bucket: "files",
    requiresOptimization: false,
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ["video/mp4", "video/webm", "video/quicktime"],
    bucket: "files",
    requiresOptimization: false,
  },
  audio: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ["audio/mpeg", "audio/wav", "audio/ogg"],
    bucket: "files",
    requiresOptimization: false,
  },
};

interface UploadResult {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  bucket: string;
  optimized?: boolean;
}

// Disable body parser to handle multipart data
export const config = {
  api: {
    bodyParser: false,
  },
};

async function secureUploadHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: AuthenticatedUser,
) {
  if (req.method !== "POST") {
    throw new ApiValidationError(
      ApiErrorCode.BAD_REQUEST,
      "Only POST method allowed",
    );
  }

  const supabaseAdmin = getServiceSupabase();
  const uploadType = (req.query.type as string) || "image";

  if (!FILE_CONFIGS[uploadType as keyof typeof FILE_CONFIGS]) {
    throw new ApiValidationError(
      ApiErrorCode.BAD_REQUEST,
      "Invalid upload type",
    );
  }

  const config = FILE_CONFIGS[uploadType as keyof typeof FILE_CONFIGS];

  try {
    // Parse the multipart form data
    const { files, fields } = await parseForm(req, config.maxSize);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      throw new ApiValidationError(
        ApiErrorCode.BAD_REQUEST,
        "No file provided",
      );
    }

    // Security validations
    await validateFile(file, config);

    // Virus scan (placeholder - integrate with ClamAV or similar)
    await performVirusScan(file);

    // Generate secure filename
    const secureFileName = generateSecureFileName(file, user.id);

    let processedFile = file;
    let optimized = false;

    // Image optimization if required
    if (config.requiresOptimization) {
      processedFile = await optimizeImage(file, config);
      optimized = true;
    }

    // Upload to Supabase Storage
    const uploadResult = await uploadToStorage(
      processedFile,
      secureFileName,
      config.bucket,
      user.id,
    );

    // Store file metadata
    const metadata = await storeFileMetadata(
      supabaseAdmin,
      uploadResult,
      file,
      fields.description as string,
      user.id,
      optimized,
    );

    // Invalidate user's content cache
    await cacheManager.invalidateUserCache(user.id);

    // Cleanup temporary files
    await cleanupTempFiles([file, processedFile]);

    logger.info("File uploaded successfully", {
      userId: user.id,
      fileName: uploadResult.fileName,
      size: uploadResult.size,
      type: uploadType,
      optimized,
    });

    sendSuccess(
      res,
      {
        id: metadata.id,
        fileName: uploadResult.fileName,
        url: uploadResult.url,
        size: uploadResult.size,
        mimeType: uploadResult.mimeType,
        optimized,
      },
      "File uploaded successfully",
    );
  } catch (error) {
    logger.error("File upload failed", {
      error,
      userId: user.id,
      uploadType,
    });
    throw error;
  }
}

async function parseForm(
  req: NextApiRequest,
  maxFileSize: number,
): Promise<{ files: formidable.Files; fields: formidable.Fields }> {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize,
      maxFiles: 1,
      maxFields: 10,
      maxFieldsSize: 2 * 1024, // 2KB for fields
      allowEmptyFiles: false,
      minFileSize: 1,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(
          new ApiValidationError(
            ApiErrorCode.BAD_REQUEST,
            `Form parsing error: ${err.message}`,
          ),
        );
      } else {
        resolve({ files, fields });
      }
    });
  });
}

async function validateFile(file: File, config: any): Promise<void> {
  // Check file type
  if (!config.allowedTypes.includes(file.mimetype || "")) {
    throw new ApiValidationError(
      ApiErrorCode.BAD_REQUEST,
      `File type ${file.mimetype} not allowed. Allowed types: ${config.allowedTypes.join(", ")}`,
    );
  }

  // Check file size
  if (file.size > config.maxSize) {
    throw new ApiValidationError(
      ApiErrorCode.BAD_REQUEST,
      `File size ${file.size} exceeds maximum ${config.maxSize} bytes`,
    );
  }

  // Additional security checks
  const fileBuffer = await fs.readFile(file.filepath);

  // Check file header matches extension (basic magic number check)
  const isValidHeader = await validateFileHeader(
    fileBuffer,
    file.mimetype || "",
  );
  if (!isValidHeader) {
    throw new ApiValidationError(
      ApiErrorCode.BAD_REQUEST,
      "File content does not match its extension",
    );
  }

  // Check for embedded malicious content in images
  if (file.mimetype?.startsWith("image/")) {
    await validateImageContent(fileBuffer);
  }
}

async function validateFileHeader(
  buffer: Buffer,
  mimeType: string,
): Promise<boolean> {
  const signatures: Record<string, Buffer[]> = {
    "image/jpeg": [Buffer.from([0xff, 0xd8, 0xff])],
    "image/png": [
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ],
    "image/webp": [Buffer.from("WEBP", "ascii")],
    "image/gif": [
      Buffer.from("GIF87a", "ascii"),
      Buffer.from("GIF89a", "ascii"),
    ],
    "application/pdf": [Buffer.from([0x25, 0x50, 0x44, 0x46])],
  };

  const validSignatures = signatures[mimeType];
  if (!validSignatures) return true; // Unknown type, allow it

  return validSignatures.some(
    (signature) =>
      buffer.subarray(0, signature.length).equals(signature) ||
      buffer.indexOf(signature) !== -1,
  );
}

async function validateImageContent(buffer: Buffer): Promise<void> {
  // Check for suspicious patterns that might indicate embedded scripts
  const suspiciousPatterns = [
    /<script/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /%3cscript/gi,
  ];

  const bufferString = buffer.toString("ascii").toLowerCase();

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(bufferString)) {
      throw new ApiValidationError(
        ApiErrorCode.BAD_REQUEST,
        "Image contains suspicious content",
      );
    }
  }
}

async function performVirusScan(file: File): Promise<void> {
  // Placeholder for virus scanning
  // In production, integrate with ClamAV, VirusTotal, or similar service

  const fileBuffer = await fs.readFile(file.filepath);

  // Simple check for known malicious patterns
  const maliciousPatterns = [
    /X5O!P%@AP\[4\\PZX54\(P\^\)7CC\)7\}\$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!\$H\+H\*/,
  ];

  const content = fileBuffer.toString("ascii");

  for (const pattern of maliciousPatterns) {
    if (pattern.test(content)) {
      logger.logSecurityEvent("malicious_file_detected", "critical", {
        fileName: file.originalFilename,
        size: file.size,
        pattern: pattern.source,
      });
      throw new ApiValidationError(
        ApiErrorCode.BAD_REQUEST,
        "File appears to contain malicious content",
      );
    }
  }
}

function generateSecureFileName(file: File, userId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString("hex");
  const extension = path.extname(file.originalFilename || "") || "";

  // Create a hash of user ID and timestamp for uniqueness
  const hash = crypto
    .createHash("sha256")
    .update(`${userId}${timestamp}${random}`)
    .digest("hex")
    .substring(0, 16);

  return `${userId}/${timestamp}_${hash}${extension}`;
}

async function optimizeImage(file: File, config: any): Promise<File> {
  const inputBuffer = await fs.readFile(file.filepath);

  let sharpInstance = sharp(inputBuffer)
    .jpeg({ quality: 85 }) // Good quality with compression
    .withMetadata(false); // Remove EXIF data for privacy

  // Resize if dimensions specified
  if (config.dimensions) {
    sharpInstance = sharpInstance.resize(
      config.dimensions.width,
      config.dimensions.height,
      {
        fit: "cover",
        withoutEnlargement: true,
      },
    );
  }

  const optimizedBuffer = await sharpInstance.toBuffer();

  // Create optimized file path
  const optimizedPath = file.filepath + "_optimized";
  await fs.writeFile(optimizedPath, optimizedBuffer);

  // Return new file object
  return {
    ...file,
    filepath: optimizedPath,
    size: optimizedBuffer.length,
  };
}

async function uploadToStorage(
  file: File,
  fileName: string,
  bucket: string,
  userId: string,
): Promise<UploadResult> {
  const supabaseAdmin = getServiceSupabase();

  const fileBuffer = await fs.readFile(file.filepath);

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false, // Don't overwrite existing files
    });

  if (error) {
    logger.error("Storage upload failed", { error, fileName, bucket });
    throw new ApiValidationError(
      ApiErrorCode.INTERNAL_ERROR,
      "Failed to upload file to storage",
    );
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);

  return {
    id: crypto.randomUUID(),
    fileName,
    originalName: file.originalFilename || "unknown",
    url: publicUrl,
    size: file.size,
    mimeType: file.mimetype || "application/octet-stream",
    bucket,
  };
}

async function storeFileMetadata(
  supabaseAdmin: any,
  uploadResult: UploadResult,
  originalFile: File,
  description: string,
  userId: string,
  optimized: boolean,
) {
  const { data, error } = await supabaseAdmin
    .from("file_descriptions")
    .insert({
      user_id: userId,
      file_name: uploadResult.fileName,
      original_name: uploadResult.originalName,
      description: description || "",
      file_type: getFileType(uploadResult.mimeType),
      mime_type: uploadResult.mimeType,
      file_size: uploadResult.size,
      bucket_name: uploadResult.bucket,
      status: "published",
      metadata: {
        optimized,
        upload_ip: process.env.NODE_ENV === "development" ? "dev" : "unknown",
        upload_user_agent: "api",
      },
    })
    .select()
    .single();

  if (error) {
    logger.error("Failed to store file metadata", {
      error,
      fileName: uploadResult.fileName,
    });
    throw new ApiValidationError(
      ApiErrorCode.INTERNAL_ERROR,
      "Failed to store file metadata",
    );
  }

  return data;
}

function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType === "application/pdf" || mimeType.startsWith("text/"))
    return "document";
  return "other";
}

async function cleanupTempFiles(files: File[]): Promise<void> {
  for (const file of files) {
    try {
      await fs.unlink(file.filepath);
    } catch (error) {
      logger.warn("Failed to cleanup temp file", {
        filepath: file.filepath,
        error,
      });
    }
  }
}

// Create API handler with enhanced security
const handler = createApiHandler(requireAuth(secureUploadHandler), {
  methods: ["POST"],
  rateLimit: { maxRequests: 20, windowMs: 300000 }, // 20 uploads per 5 minutes
  cors: true,
  monitoring: {
    trackPerformance: true,
    logRequests: true,
  },
});

export default handler;
