import { useState, useCallback } from "react";

interface UploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

interface UseImageUploadReturn {
  selectedImage: File | null;
  imagePreview: string | null;
  uploadedImageUrl: string | null;
  isUploading: boolean;
  error: string | null;
  selectImage: (file: File) => void;
  uploadImage: (options?: UploadOptions) => Promise<string | null>;
  removeImage: () => void;
  resetState: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectImage = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be smaller than 10MB");
        return;
      }

      setError(null);
      setSelectedImage(file);

      // Create preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    },
    [imagePreview],
  );

  const uploadImage = useCallback(
    async (options: UploadOptions = {}): Promise<string | null> => {
      if (!selectedImage) {
        setError("No image selected");
        return null;
      }

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", selectedImage);

        // Add options
        if (options.maxWidth)
          formData.append("maxWidth", options.maxWidth.toString());
        if (options.maxHeight)
          formData.append("maxHeight", options.maxHeight.toString());
        if (options.quality)
          formData.append("quality", options.quality.toString());
        if (options.generateThumbnail)
          formData.append("generateThumbnail", "true");
        if (options.thumbnailSize)
          formData.append("thumbnailSize", options.thumbnailSize.toString());

        const response = await fetch("/api/upload/artwork-images", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Upload failed with status ${response.status}`,
          );
        }

        const result = await response.json();
        if (result.success && result.images?.[0]?.url) {
          const imageUrl = result.images[0].url;
          setUploadedImageUrl(imageUrl);
          return imageUrl;
        }

        throw new Error("Invalid response from upload service");
      } catch (uploadError) {
        const errorMessage =
          uploadError instanceof Error ? uploadError.message : "Upload failed";
        setError(errorMessage);
        console.error("Image upload failed:", uploadError);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [selectedImage],
  );

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setUploadedImageUrl(null);
    setError(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  }, [imagePreview]);

  const resetState = useCallback(() => {
    removeImage();
  }, [removeImage]);

  return {
    selectedImage,
    imagePreview,
    uploadedImageUrl,
    isUploading,
    error,
    selectImage,
    uploadImage,
    removeImage,
    resetState,
  };
}
