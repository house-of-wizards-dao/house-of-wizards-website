import dynamic from "next/dynamic";
import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useRef,
  useMemo,
  startTransition,
  MouseEvent,
  TouchEvent,
  KeyboardEvent,
  WheelEvent,
  ChangeEvent,
} from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Spinner } from "@nextui-org/spinner";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ZoomIn, ZoomOut } from "lucide-react";
import type {
  GalleryItemData,
  DragPosition,
  ImageModalProps,
  GalleryItemProps,
  UserProfile,
} from "@/types";

import DefaultLayout from "@/layouts/default";

const getCDNURL = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
    return "https://placeholder.supabase.co/storage/v1/object/public/files/";
  }
  return `${supabaseUrl}/storage/v1/object/public/files/`;
};
const IMAGES_PER_PAGE = 20;

// Add file transformation parameters
const getFileUrl = (
  userId: string,
  name: string,
  isThumb: boolean = false,
): string => {
  const baseUrl = `${getCDNURL()}${userId}/${name}`;

  if (
    name.toLowerCase().endsWith(".gif") ||
    name.toLowerCase().endsWith(".mp4")
  ) {
    return baseUrl; // Don't transform GIFs or videos
  }

  // Reduce quality for thumbnails more aggressively, and add size limits for full images
  return isThumb
    ? `${baseUrl}?width=250&height=250&resize=contain&quality=20`
    : `${baseUrl}?width=1000&height=1000&resize=contain&quality=80`;
};

// Extracted Modal Component for better code splitting
const ImageModal = React.memo<ImageModalProps>(({ item, onClose, isOpen }) => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState<DragPosition>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.5); // Add configurable zoom level
  const dragStartPosition = useRef<DragPosition>({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomToggle = (): void => {
    if (!isDragging) {
      // Reset position when toggling zoom
      setDragPosition({ x: 0, y: 0 });
      setIsZoomed(!isZoomed);
    }
  };

  const handleZoomIn = useCallback((): void => {
    if (isZoomed) {
      setZoomLevel((prev) => Math.min(prev + 0.25, 3)); // Limit max zoom to 3x
    } else {
      setIsZoomed(true);
    }
  }, [isZoomed]);

  const handleZoomOut = useCallback((): void => {
    if (isZoomed && zoomLevel > 1.25) {
      setZoomLevel((prev) => prev - 0.25);
    } else {
      setIsZoomed(false);
      setZoomLevel(1.5); // Reset to default zoom level
    }
  }, [isZoomed, zoomLevel]);

  const handleDragStart = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!isZoomed) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setIsDragging(true);
      dragStartPosition.current = {
        x: clientX - dragPosition.x,
        y: clientY - dragPosition.y,
      };

      // Prevent default behavior to avoid text selection during drag
      e.preventDefault();

      // Change cursor immediately
      if (imageContainerRef.current) {
        imageContainerRef.current.style.cursor = "grabbing";
      }
    },
    [isZoomed, dragPosition],
  );

  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!isDragging || !isZoomed) return;
      e.preventDefault();

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Calculate boundaries based on zoom level to prevent dragging too far
      const containerRect = imageContainerRef.current?.getBoundingClientRect();

      if (!containerRect) return;

      const maxX = (containerRect.width * (zoomLevel - 1)) / 2;
      const maxY = (containerRect.height * (zoomLevel - 1)) / 2;

      const newX = clientX - dragStartPosition.current.x;
      const newY = clientY - dragStartPosition.current.y;

      // Apply boundaries
      const boundedX = Math.max(-maxX, Math.min(maxX, newX));
      const boundedY = Math.max(-maxY, Math.min(maxY, newY));

      setDragPosition({
        x: boundedX,
        y: boundedY,
      });
    },
    [isDragging, isZoomed, zoomLevel],
  );

  const handleDragEnd = useCallback((): void => {
    setIsDragging(false);

    // Reset cursor
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = "grab";
    }
  }, []);

  // Reset zoom and position when changing images
  useEffect(() => {
    setIsZoomed(false);
    setDragPosition({ x: 0, y: 0 });
    setZoomLevel(1.5);
  }, [item]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add wheel event for zooming with mouse wheel
    const handleWheel = (event: WheelEvent): void => {
      if (modalRef.current && modalRef.current.contains(event.target as Node)) {
        event.preventDefault();
        if (event.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside as any);
    document.addEventListener("keydown", handleEscape as any);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);
    document.addEventListener("wheel", handleWheel as any, { passive: false });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
      document.removeEventListener("keydown", handleEscape as any);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
      document.removeEventListener("wheel", handleWheel as any);
    };
  }, [isOpen, onClose, handleDragEnd, handleZoomIn, handleZoomOut]);

  if (!item || !isOpen || !item.name) return null;

  const isVideo =
    (item.fileType &&
      typeof item.fileType === "string" &&
      item.fileType.startsWith("video/")) ||
    (item.name &&
      typeof item.name === "string" &&
      item.name.toLowerCase().endsWith(".mp4"));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-background border-1.5 border-brand-900 sm:p-6 p-3 rounded-xl max-w-[95vw] w-fit relative"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            {!isVideo && (
              <>
                <button
                  aria-label="Zoom in"
                  className="text-brand-500 hover:text-brand-600 transition-colors"
                  type="button"
                  onClick={handleZoomIn}
                >
                  <ZoomIn size={22} />
                </button>
                {isZoomed && (
                  <button
                    aria-label="Zoom out"
                    className="text-brand-500 hover:text-brand-600 transition-colors"
                    type="button"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut size={22} />
                  </button>
                )}
              </>
            )}
          </div>
          <button
            aria-label="Close modal"
            className="sm:text-2xl text-xl text-brand-500 cursor-pointer hover:text-brand-600 transition-colors"
            type="button"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isZoomed ? "cursor-move" : "cursor-zoom-in"}`}
        >
          {isVideo ? (
            <video
              controls
              className="w-full aspect-video object-contain rounded-xl"
              preload="metadata"
              style={{ maxHeight: isZoomed ? "85vh" : "65vh" }}
            >
              <source
                src={getFileUrl(item.userId, item.name)}
                type={item.fileType || "video/mp4"}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              ref={imageContainerRef}
              className="flex justify-center items-center transition-transform duration-300"
              style={{
                transform: isZoomed
                  ? `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)`
                  : "none",
                cursor: isDragging ? "grabbing" : isZoomed ? "grab" : "zoom-in",
                touchAction: "none",
                willChange: "transform", // Optimize for animations
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              role="button"
              tabIndex={0}
              aria-label={isZoomed ? "Zoom out image" : "Zoom in image"}
              onClick={handleZoomToggle}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleZoomToggle();
                }
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onTouchMove={handleDragMove}
              onTouchStart={handleDragStart}
            >
              <Image
                priority
                alt={item.description || "Gallery image"}
                className={`w-auto rounded-xl transition-all duration-300 ${isZoomed ? "max-h-[75vh]" : "max-h-[65vh]"}`}
                draggable={false}
                height={800}
                loading="eager"
                quality={80}
                src={getFileUrl(item.userId, item.name, false)}
                style={{
                  objectFit: "contain",
                  pointerEvents: isZoomed ? "none" : "auto",
                }}
                unoptimized
                width={1000}
              />
            </div>
          )}
        </div>
        <div className="mt-3 text-center flex items-center flex-col">
          <p className="text-foreground font-medium sm:text-lg text-sm font-pop mb-1 w-full px-2 uppercase line-clamp-2">
            {item.description}
          </p>
          <p className="text-brand-500 font-atirose text-xl sm:text-2xl">
            {item.userName}
          </p>
        </div>
      </div>
    </div>
  );
});

ImageModal.displayName = "ImageModal";

// Extracted Gallery Item Component
const GalleryItem = React.memo<GalleryItemProps>(
  ({ item, onClick, priority }) => {
    if (!item || !item.name) return null;

    const isVideo =
      (item.fileType &&
        typeof item.fileType === "string" &&
        item.fileType.startsWith("video/")) ||
      (item.name &&
        typeof item.name === "string" &&
        item.name.toLowerCase().endsWith(".mp4"));

    const handleClick = (): void => {
      onClick(item);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(item);
      }
    };

    return (
      <div
        aria-label={`View artwork: ${item.description || "Untitled"} by ${item.userName}`}
        className="group relative overflow-hidden hover:scale-[1.02] cursor-pointer border border-brand-900 bg-transparent/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:border-brand-500 hover:shadow-xl"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className="relative aspect-square overflow-hidden">
          {isVideo ? (
            <video
              className="w-full h-full object-cover"
              poster={`${getCDNURL()}${item.userId}/${item.name}?width=150&height=150&format=webp&quality=30`}
              preload="none"
            >
              <source
                src={getFileUrl(item.userId, item.name)}
                type={item.fileType || "video/mp4"}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              alt={item.description || "Gallery image"}
              blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Crect width='10' height='10' fill='%23999999'/%3E%3Cpath d='M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2' stroke='%23777777' stroke-width='0.5'/%3E%3C/svg%3E"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              height={300}
              loading={priority ? "eager" : "lazy"}
              placeholder="blur"
              priority={priority}
              quality={60}
              src={getFileUrl(item.userId, item.name, true)}
              unoptimized
              width={300}
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 space-y-1">
          <p className="text-gray-300 text-sm truncate">
            {item.description || "Untitled"}
          </p>
          <p className="text-brand-500 font-atirose text-lg">
            {item.userName || "Anonymous"}
          </p>
        </div>
      </div>
    );
  },
);

GalleryItem.displayName = "GalleryItem";

// Main Gallery Component
function GalleryPage(): JSX.Element {
  const supabase = useSupabaseClient();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [content, setContent] = useState<GalleryItemData[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const isLoading = content.length === 0;

  // Memoized derived states
  const allArtists = useMemo(
    () =>
      Array.from(new Set(content.map((item) => item.userName))).filter(Boolean),
    [content],
  );

  const filteredContent = useMemo(
    () =>
      selectedArtist
        ? content.filter((item) => item.userName === selectedArtist)
        : content,
    [content, selectedArtist],
  );

  const currentItems = useMemo(
    () =>
      filteredContent.slice(
        (currentPage - 1) * IMAGES_PER_PAGE,
        currentPage * IMAGES_PER_PAGE,
      ),
    [filteredContent, currentPage],
  );

  const pageCount = useMemo(
    () => Math.ceil(filteredContent.length / IMAGES_PER_PAGE),
    [filteredContent.length],
  );

  // Add virtualization for large galleries
  const IMAGES_TO_PRELOAD = 8; // Only preload first 8 images

  useEffect(() => {
    const fetchAllContent = async (): Promise<void> => {
      try {
        // Use active_profiles view to exclude soft-deleted users
        const { data: users, error: usersError } = await supabase
          .from("active_profiles")
          .select("id, name");

        if (usersError) {
          return;
        }

        if (!users) return;

        // Use active_file_descriptions view to exclude soft-deleted content
        const { data: fileDescData, error: fileDescError } = await supabase
          .from("active_file_descriptions")
          .select("file_name, description, file_type, user_id, created_at");

        if (fileDescError) {
          return;
        }

        const allContent = await Promise.all(
          users.map(async (user: UserProfile) => {
            const { data: fileData, error: fileError } = await supabase.storage
              .from("files")
              .list(user.id + "/");

            if (fileError) {
              return [];
            }

            return (fileData || []).map((file) => ({
              ...file,
              userId: user.id,
              userName: user.name || "Anonymous",
              description: fileDescData?.find(
                (desc) =>
                  desc.file_name === file.name && desc.user_id === user.id,
              )?.description,
              fileType:
                fileDescData?.find(
                  (desc) =>
                    desc.file_name === file.name && desc.user_id === user.id,
                )?.file_type || "",
            }));
          }),
        );

        // Sort content by most recent first and filter out items without descriptions
        const flatContent = allContent
          .flat()
          .filter(
            (item) =>
              item.description && item.name && typeof item.name === "string",
          ) // Only show items with descriptions and valid names
          .sort(
            (a, b) =>
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime(),
          );

        startTransition(() => {
          setContent(flatContent);
        });
      } catch (error) {}
    };

    fetchAllContent();
  }, [supabase]);

  const handleItemClick = useCallback((item: GalleryItemData): void => {
    startTransition(() => {
      setSelectedItem(item);
      setModalOpen(true);
    });
  }, []);

  const handleCloseModal = useCallback((): void => {
    startTransition(() => {
      setModalOpen(false);
      setSelectedItem(null);
    });
  }, []);

  const handleArtistChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    startTransition(() => {
      setSelectedArtist(e.target.value || null);
      setCurrentPage(1);
    });
  };

  const handlePrevPage = (): void => {
    startTransition(() => setCurrentPage((prev) => Math.max(1, prev - 1)));
  };

  const handleNextPage = (): void => {
    startTransition(() =>
      setCurrentPage((prev) => Math.min(pageCount, prev + 1)),
    );
  };

  const handlePageClick = (page: number): void => {
    startTransition(() => setCurrentPage(page));
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="container flex flex-col sm:gap-6 gap-3 justify-center items-center max-w-7xl mx-auto px-4">
          <div className="h-screen w-full flex items-center justify-center">
            <Spinner color="default" labelColor="foreground" size="lg" />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="flex flex-col justify-center items-center mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-atirose text-brand-500 text-5xl md:text-6xl mb-4">
            Gallery
          </h1>
          <p
            className="font-quad text-sm text-gray-400 text-center uppercase
"
          >
            Explore the creative works from our talented community of artists.
          </p>
        </div>

        <div className="w-full mb-12">
          <svg
            aria-label="Decorative separator"
            className="w-full"
            fill="none"
            preserveAspectRatio="none"
            role="img"
            viewBox="0 0 330 8"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_453_22)">
              <path
                d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
                fill="transparent"
              />
              <path
                d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
                stroke="#A986D9"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <defs>
              <clipPath id="clip0_453_22">
                <rect fill="white" height="8" width="330" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl w-full">
          <div className="mb-8 px-4">
            <div className="flex justify-between items-center">
              <label className="sr-only" htmlFor="artist-filter">
                Filter by artist
              </label>
              <select
                className="cursor-pointer bg-background/50 backdrop-blur-sm text-foreground rounded-full text-sm px-4 py-2 border border-brand-900 hover:border-brand-500 transition-colors"
                id="artist-filter"
                value={selectedArtist || ""}
                onChange={handleArtistChange}
              >
                <option value="">All Artists</option>
                {allArtists.map((artist) => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-400">
                {filteredContent.length}{" "}
                {filteredContent.length === 1 ? "artwork" : "artworks"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4">
            {currentItems.map((item, index) => (
              <GalleryItem
                key={`${item.userId}-${item.name}`}
                item={item}
                priority={index < IMAGES_TO_PRELOAD} // Only prioritize first few images
                onClick={handleItemClick}
              />
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center mt-12 gap-2 flex-wrap px-4">
              <Button
                aria-label="Previous page"
                className="px-3 py-2 rounded-full bg-transparent border border-brand-900 text-white disabled:opacity-50 hover:border-brand-500 hover:bg-brand-500/20 transition-all"
                disabled={currentPage === 1}
                onClick={handlePrevPage}
              >
                <ChevronLeft className="text-xl" />
              </Button>

              {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
                // Show first 3, last 3, and current page with neighbors
                const showPageNumbers = pageCount <= 7;
                const isFirstPages = i < 3;
                const isLastPages = i >= pageCount - 3;
                const isCurrentPageArea = Math.abs(currentPage - (i + 1)) <= 1;

                if (
                  showPageNumbers ||
                  isFirstPages ||
                  isLastPages ||
                  isCurrentPageArea
                ) {
                  return (
                    <Button
                      key={i}
                      aria-current={currentPage === i + 1 ? "page" : undefined}
                      aria-label={`Go to page ${i + 1}`}
                      className={`min-w-[40px] px-3 py-2 rounded-full text-sm transition-all ${
                        currentPage === i + 1
                          ? "bg-brand-500 text-white"
                          : "bg-transparent border border-brand-900 text-white hover:border-brand-500 hover:bg-brand-500/20"
                      }`}
                      onClick={() => handlePageClick(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  );
                } else if (i === 3 && pageCount > 7 && currentPage > 4) {
                  return (
                    <span
                      key="ellipsis1"
                      aria-hidden="true"
                      className="px-2 py-1"
                    >
                      ...
                    </span>
                  );
                } else if (
                  i === pageCount - 4 &&
                  pageCount > 7 &&
                  currentPage < pageCount - 3
                ) {
                  return (
                    <span
                      key="ellipsis2"
                      aria-hidden="true"
                      className="px-2 py-1"
                    >
                      ...
                    </span>
                  );
                }

                return null;
              }).filter(Boolean)}

              <Button
                aria-label="Next page"
                className="px-3 py-2 rounded-full bg-transparent border border-brand-900 text-white disabled:opacity-50 hover:border-brand-500 hover:bg-brand-500/20 transition-all"
                disabled={currentPage === pageCount}
                onClick={handleNextPage}
              >
                <ChevronRight className="text-xl" />
              </Button>
            </div>
          )}

          <ImageModal
            isOpen={modalOpen}
            item={selectedItem}
            onClose={handleCloseModal}
          />
        </div>
      </div>
    </DefaultLayout>
  );
}

// Simple error wrapper for gallery - remove class-based error boundary since it's causing React type conflicts
function GalleryErrorWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <>{children}</>;
}

// Export wrapped component with dynamic import
export default dynamic(
  () =>
    Promise.resolve(function GalleryPageWrapper(): JSX.Element {
      return (
        <GalleryErrorWrapper>
          <div className="min-h-screen">
            <Suspense
              fallback={
                <div className="h-screen w-full flex items-center justify-center">
                  <Spinner color="default" labelColor="foreground" size="lg" />
                </div>
              }
            >
              <GalleryPage />
            </Suspense>
          </div>
        </GalleryErrorWrapper>
      );
    }),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center">
        <Spinner color="default" labelColor="foreground" size="lg" />
      </div>
    ),
  },
);
