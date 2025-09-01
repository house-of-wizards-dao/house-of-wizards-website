import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@nextui-org/button";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import type { FileData } from "@/types";
import { useFocusNavigation } from "@/hooks/useKeyboardNavigation";
import { LazyImage } from "@/components/ui/LazyImage";

interface FileGalleryProps {
  files: FileData[];
  onDeleteFile: (file: FileData) => void;
}

export default function FileGallery({
  files,
  onDeleteFile,
}: FileGalleryProps): JSX.Element {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const { onKeyDown: handleNavigation } = useFocusNavigation({
    itemCount: files.length,
    currentIndex: focusedIndex,
    onIndexChange: setFocusedIndex,
    orientation: "grid",
    gridColumns: 3, // Assuming 3 columns layout
    loop: true,
  });

  const renderFilePreview = useCallback(
    (file: FileData): JSX.Element => {
      if (!user?.id) return <div>No preview available</div>;

      // Get the Supabase URL from the client
      const supabaseUrl = (supabase as any).supabaseUrl;
      const fileUrl = `${supabaseUrl}/storage/v1/object/public/files/${user.id}/${file.name}`;
      console.log("FileGallery - Supabase URL:", supabaseUrl);
      console.log("FileGallery - Generated URL:", fileUrl);
      console.log("FileGallery - File data:", file);

      if (file.fileType?.startsWith("video/")) {
        return (
          <video
            controls
            className="object-cover rounded-xl aspect-square"
            height="175"
            width="175"
          >
            <source src={fileUrl} type={file.fileType} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return (
          <LazyImage
            alt={file.description || "User uploaded content"}
            className="object-cover rounded-xl aspect-square"
            height={175}
            width={175}
            src={fileUrl}
            priority={false}
            fallback={
              <div className="w-[175px] h-[175px] bg-neutral-700 rounded-xl flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            }
            errorFallback={
              <div className="w-[175px] h-[175px] bg-neutral-800 border-2 border-dashed border-neutral-600 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-8 h-8 text-neutral-500 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <span className="text-xs text-neutral-500">
                    Failed to load
                  </span>
                </div>
              </div>
            }
          />
        );
      }
    },
    [user?.id, supabase],
  );

  const emptyState = useMemo(() => {
    if (files.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No files uploaded yet. Upload some art to get started!
          </p>
        </div>
      );
    }
    return null;
  }, [files.length]);

  if (emptyState) {
    return emptyState;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
      onKeyDown={handleNavigation}
      role="grid"
      aria-label="File gallery"
    >
      {files.map((file, index) => (
        <div
          key={`file-${user?.id}-${file.name}`}
          className={`flex flex-col items-center justify-between border border-brand-500/30 bg-neutral-900/50 rounded-2xl p-4 transition-all duration-300 hover:border-brand-500/50 hover:bg-neutral-800/50 ${
            index === focusedIndex ? "ring-2 ring-brand-500" : ""
          }`}
          role="gridcell"
          tabIndex={index === focusedIndex ? 0 : -1}
          aria-label={`File: ${file.description || file.name}`}
        >
          <div className="p-2 w-full flex justify-center">
            {renderFilePreview(file)}
          </div>
          <p className="text-brand-500 font-heading text-sm text-center mt-3 mb-3 line-clamp-2">
            {file.description}
          </p>
          <div className="w-full">
            <Button
              aria-label={`Delete ${file.name}`}
              className="text-white font-medium text-sm w-full"
              color="danger"
              size="sm"
              onClick={() => onDeleteFile(file)}
            >
              Delete File
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
