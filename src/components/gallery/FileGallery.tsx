import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import type { FileData } from "@/types";
import { useFocusNavigation } from "@/hooks/useKeyboardNavigation";

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
          <Image
            alt={file.description || "User uploaded content"}
            className="object-cover rounded-xl aspect-square"
            height={175}
            src={fileUrl}
            unoptimized
            width={175}
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
