import { getServiceSupabase } from "../supabase";
import { logger } from "../logger";
import { fileUploadSchema } from "../validation-schemas";

export interface ImageUploadResult {
  url: string;
  thumbnail_url: string;
  public_url: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
  allowedTypes?: string[];
}

export class ImageUploadService {
  private supabase = getServiceSupabase();
  private bucket = "artwork-images";

  constructor() {
    this.ensureBucketExists();
  }

  async uploadArtworkImages(
    files: File[],
    userId: string,
    options: ImageUploadOptions = {},
  ): Promise<ImageUploadResult[]> {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 0.9,
      generateThumbnail = true,
      thumbnailSize = 400,
      allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    } = options;

    // Validate files
    for (const file of files) {
      this.validateImageFile(file, allowedTypes);
    }

    const results: ImageUploadResult[] = [];

    for (const file of files) {
      try {
        // Process the image (resize, optimize)
        const processedFile = await this.processImage(file, {
          maxWidth,
          maxHeight,
          quality,
        });

        // Generate thumbnail if required
        const thumbnailFile = generateThumbnail
          ? await this.generateThumbnail(file, thumbnailSize)
          : null;

        // Generate unique file paths
        const timestamp = Date.now();
        const fileExtension = this.getFileExtension(file.name);
        const baseFileName = `${userId}/${timestamp}-${this.sanitizeFileName(file.name)}`;

        const mainFilePath = `${baseFileName}${fileExtension}`;
        const thumbnailPath = thumbnailFile
          ? `thumbnails/${baseFileName}-thumb${fileExtension}`
          : mainFilePath;

        // Upload main image
        const { data: mainUpload, error: mainError } =
          await this.supabase.storage
            .from(this.bucket)
            .upload(mainFilePath, processedFile, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

        if (mainError) {
          throw new Error(`Failed to upload main image: ${mainError.message}`);
        }

        // Upload thumbnail if generated
        let thumbnailUpload = null;
        if (thumbnailFile) {
          const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .upload(thumbnailPath, thumbnailFile, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type,
            });

          if (error) {
            logger.warn("Failed to upload thumbnail, using main image", error);
          } else {
            thumbnailUpload = data;
          }
        }

        // Get public URLs
        const { data: mainUrl } = this.supabase.storage
          .from(this.bucket)
          .getPublicUrl(mainFilePath);

        const { data: thumbUrl } = this.supabase.storage
          .from(this.bucket)
          .getPublicUrl(thumbnailUpload?.path || mainFilePath);

        results.push({
          url: mainUrl.publicUrl,
          thumbnail_url: thumbUrl.publicUrl,
          public_url: mainUrl.publicUrl,
          file_path: mainFilePath,
          file_size: processedFile.size,
          mime_type: file.type,
        });

        logger.info("Successfully uploaded artwork image", {
          userId,
          fileName: file.name,
          filePath: mainFilePath,
          fileSize: processedFile.size,
        });
      } catch (error) {
        logger.error("Error uploading artwork image", error);
        throw new Error(
          `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return results;
  }

  async deleteArtworkImage(filePath: string, userId: string): Promise<void> {
    // Verify user owns the file (security check)
    if (!filePath.startsWith(userId)) {
      throw new Error("Permission denied: cannot delete file");
    }

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([filePath]);

    if (error) {
      logger.error("Error deleting artwork image", error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    // Also try to delete thumbnail
    const thumbnailPath = filePath
      .replace(`${userId}/`, `thumbnails/${userId}/`)
      .replace(/(\.[^.]+)$/, "-thumb$1");
    await this.supabase.storage
      .from(this.bucket)
      .remove([thumbnailPath])
      .catch(() => {}); // Ignore errors for thumbnail deletion

    logger.info("Successfully deleted artwork image", {
      userId,
      filePath,
    });
  }

  async getImageUrl(
    filePath: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      throw new Error(`Failed to get image URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  private validateImageFile(file: File, allowedTypes: string[]): void {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(", ")}`,
      );
    }

    // Validate file size (max 10MB for artwork images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 10MB`,
      );
    }

    // Validate using Zod schema
    const validation = fileUploadSchema.safeParse({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!validation.success) {
      throw new Error(
        `Invalid file: ${validation.error.errors.map((e) => e.message).join(", ")}`,
      );
    }
  }

  private async processImage(
    file: File,
    options: { maxWidth: number; maxHeight: number; quality: number },
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Cannot create canvas context"));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const { maxWidth, maxHeight } = options;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to process image"));
              return;
            }

            const processedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(processedFile);
          },
          file.type,
          options.quality,
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }

  private async generateThumbnail(file: File, size: number): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Cannot create canvas context"));
        return;
      }

      img.onload = () => {
        // Calculate thumbnail dimensions (square crop from center)
        const { width, height } = img;
        const minDimension = Math.min(width, height);
        const x = (width - minDimension) / 2;
        const y = (height - minDimension) / 2;

        canvas.width = size;
        canvas.height = size;

        // Draw cropped and resized image
        ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to generate thumbnail"));
              return;
            }

            const thumbnailFile = new File([blob], `thumb-${file.name}`, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(thumbnailFile);
          },
          file.type,
          0.8, // Lower quality for thumbnails
        );
      };

      img.onerror = () =>
        reject(new Error("Failed to load image for thumbnail"));
      img.src = URL.createObjectURL(file);
    });
  }

  private sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();
  }

  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot > -1 ? fileName.substring(lastDot) : "";
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      const { data: buckets, error } =
        await this.supabase.storage.listBuckets();

      if (error) {
        logger.error("Error listing storage buckets", error);
        return;
      }

      const bucketExists = buckets?.some(
        (bucket) => bucket.name === this.bucket,
      );

      if (!bucketExists) {
        const { error: createError } = await this.supabase.storage.createBucket(
          this.bucket,
          {
            public: true,
            allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
            fileSizeLimit: 10485760, // 10MB
          },
        );

        if (createError) {
          logger.error("Error creating storage bucket", createError);
        } else {
          logger.info("Created artwork images storage bucket");
        }
      }
    } catch (error) {
      logger.error("Error ensuring bucket exists", error);
    }
  }
}

// Singleton instance
export const imageUploadService = new ImageUploadService();
