import React, { useState, useCallback } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

import type {
  FileDescriptions,
  FilePreviews,
  UploadProgressState,
} from "@/types";

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export default function FileUpload({
  onUploadComplete,
}: FileUploadProps): JSX.Element {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileDescriptions, setFileDescriptions] = useState<FileDescriptions>(
    {},
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({});
  const [filePreviews, setFilePreviews] = useState<FilePreviews>({});
  const [error, setError] = useState<string>("");

  const user = useUser();
  const supabase = useSupabaseClient();

  const handleFilesSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = Array.from(e.target.files || []);
      setSelectedFiles(files);
      setError("");

      // Initialize descriptions for new files
      const newDescriptions: FileDescriptions = {};
      const newPreviews: FilePreviews = {};

      files.forEach((file) => {
        newDescriptions[file.name] = "";

        // Generate preview URLs for images and videos
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          const previewUrl = URL.createObjectURL(file);
          newPreviews[file.name] = previewUrl;
        }
      });

      setFileDescriptions(newDescriptions);
      setFilePreviews(newPreviews);
    },
    [],
  );

  const removeSelectedFile = useCallback(
    (fileName: string): void => {
      setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));

      setFileDescriptions((prev) => {
        const newDescriptions = { ...prev };
        delete newDescriptions[fileName];
        return newDescriptions;
      });

      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });

      // Revoke the object URL when removing a file
      if (filePreviews[fileName]) {
        URL.revokeObjectURL(filePreviews[fileName]);
        setFilePreviews((prev) => {
          const newPreviews = { ...prev };
          delete newPreviews[fileName];
          return newPreviews;
        });
      }
    },
    [filePreviews],
  );

  const handleDescriptionChange = useCallback(
    (fileName: string, description: string): void => {
      setFileDescriptions((prev) => ({
        ...prev,
        [fileName]: description,
      }));
    },
    [],
  );

  const handleMultipleUpload = useCallback(async (): Promise<void> => {
    if (selectedFiles.length === 0) {
      setError("Please select files first");
      return;
    }

    if (!user?.id) {
      setError("Please sign in to upload files");
      return;
    }

    setError("");

    // Create an array to track upload promises
    const uploadPromises: Promise<any>[] = [];

    // Process each file
    for (const file of selectedFiles) {
      const fileName = uuidv4();
      const fileExt = file.name.split(".").pop();
      const fullFileName = `${fileName}.${fileExt}`;
      const description = fileDescriptions[file.name] || "";

      // Start the upload and track progress
      const uploadPromise = new Promise(async (resolve, reject) => {
        try {
          // Update progress state to show starting
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { progress: 0, status: "uploading" },
          }));

          // Upload the file
          console.log('Starting file upload...', { 
            bucket: 'files', 
            path: user.id + "/" + fullFileName, 
            fileName: fullFileName,
            fileSize: file.size 
          });
          
          const { data, error } = await supabase.storage
            .from("files")
            .upload(user.id + "/" + fullFileName, file);
            
          console.log('Upload result:', { data, error });

          if (error) {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: {
                progress: 0,
                status: "error",
                message: error.message,
              },
            }));
            reject(error);
            return;
          }

          // Add the description to a separate table
          const { error: descError } = await supabase
            .from("file_descriptions")
            .insert({
              user_id: user.id,
              file_name: fullFileName,
              description: description,
              file_type: file.type,
            });

          if (descError) {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: {
                progress: 100,
                status: "warning",
                message: "File uploaded but description failed",
              },
            }));
          } else {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: { progress: 100, status: "success" },
            }));
          }

          resolve(data);
        } catch (err) {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: {
              progress: 0,
              status: "error",
              message: (err as Error).message,
            },
          }));
          reject(err);
        }
      });

      uploadPromises.push(uploadPromise);
    }

    // Wait for all uploads to complete
    try {
      await Promise.allSettled(uploadPromises);
      onUploadComplete?.();

      // Clear the form after successful upload
      setTimeout(() => {
        setSelectedFiles([]);
        setFileDescriptions({});
        setUploadProgress({});
        // Clean up preview URLs
        Object.values(filePreviews).forEach(URL.revokeObjectURL);
        setFilePreviews({});
      }, 3000);
    } catch (err) {
      setError("Some files failed to upload");
    }
  }, [
    selectedFiles,
    fileDescriptions,
    user,
    supabase,
    onUploadComplete,
    filePreviews,
  ]);

  const renderFilePreviewForUpload = useCallback(
    (file: File): JSX.Element => {
      const preview = filePreviews[file.name];

      if (!preview) {
        return (
          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">
              {file.name.split(".").pop()}
            </span>
          </div>
        );
      }

      if (file.type.startsWith("video/")) {
        return (
          <video className="object-cover rounded-md" height="80" width="80">
            <source src={preview} type={file.type} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return (
          <Image
            alt={file.name}
            className="object-cover rounded-md"
            height={80}
            src={preview}
            unoptimized
            width={80}
          />
        );
      }
    },
    [filePreviews],
  );

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach(URL.revokeObjectURL);
    };
  }, [filePreviews]);

  return (
    <div className="sm:w-full w-full max-w-3xl">
      <p className="mt-8 sm:text-xl text-md font-medium">
        Upload your art here!
      </p>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-3 p-4 border-1 border-darkviolet rounded-xl">
        <Input
          multiple
          accept="image/png, image/jpeg, image/gif, video/mp4"
          aria-label="Select files to upload"
          className="mt-3"
          type="file"
          onChange={handleFilesSelect}
        />

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">
              Selected Files ({selectedFiles.length})
            </p>
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
              {selectedFiles.map((file) => (
                <div
                  key={file.name}
                  className="border-1 border-darkviolet rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    {/* File preview */}
                    {renderFilePreviewForUpload(file)}

                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <Button
                      aria-label={`Remove ${file.name}`}
                      color="danger"
                      size="sm"
                      variant="light"
                      onClick={() => removeSelectedFile(file.name)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    aria-label={`Description for ${file.name}`}
                    className="mt-2"
                    placeholder="Add a description"
                    type="text"
                    value={fileDescriptions[file.name] || ""}
                    onChange={(e) =>
                      handleDescriptionChange(file.name, e.target.value)
                    }
                  />

                  {uploadProgress[file.name] && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className={`h-2.5 rounded-full ${
                            uploadProgress[file.name].status === "error"
                              ? "bg-red-600"
                              : uploadProgress[file.name].status === "warning"
                                ? "bg-yellow-400"
                                : "bg-violet"
                          }`}
                          style={{
                            width: `${uploadProgress[file.name].progress}%`,
                          }}
                        />
                      </div>
                      {uploadProgress[file.name].message && (
                        <p className="text-xs mt-1 text-red-500">
                          {uploadProgress[file.name].message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="bg-[#7d7d7d] text-sm text-white font-medium mt-4 w-full"
              color="success"
              disabled={selectedFiles.length === 0}
              onClick={handleMultipleUpload}
            >
              Upload All Files
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
