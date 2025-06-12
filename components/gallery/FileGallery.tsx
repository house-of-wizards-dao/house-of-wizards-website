import React, { useMemo, useCallback, useState } from "react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";

import type { FileData } from "@/types";
import { useFocusNavigation } from "@/hooks/useKeyboardNavigation";

const CDNURL =
  "https://wqpyojcwtcuzpmghjwpp.supabase.co/storage/v1/object/public/files/";

interface FileGalleryProps {
  files: FileData[];
  onDeleteFile: (file: FileData) => void;
}

export default function FileGallery({
  files,
  onDeleteFile,
}: FileGalleryProps): JSX.Element {
  const user = useUser();
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

      const fileUrl = `${CDNURL}${user.id}/${file.name}`;

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
    [user?.id],
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
      className="flex flex-row flex-wrap sm:gap-6 gap-3 mt-5 items-center"
      onKeyDown={handleNavigation}
      role="grid"
      aria-label="File gallery"
    >
      {files.map((file, index) => (
        <div
          key={`file-${user?.id}-${file.name}`}
          className={`flex flex-col items-center justify-between border-1 border-violet rounded-2xl w-fit p-4 ${
            index === focusedIndex ? "ring-2 ring-purple-500" : ""
          }`}
          role="gridcell"
          tabIndex={index === focusedIndex ? 0 : -1}
          aria-label={`File: ${file.description || file.name}`}
        >
          <div className="sm:p-2 p-1">{renderFilePreview(file)}</div>
          <p className="text-[#9564b4] font-atirose sm:text-md text-md">
            {file.description}
          </p>
          <div className="p-3">
            <Button
              aria-label={`Delete ${file.name}`}
              className="text-white font-medium text-sm"
              color="danger"
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
