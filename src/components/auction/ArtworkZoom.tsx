import React, { useState, useRef, useCallback } from "react";
import { Card } from "@nextui-org/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Image } from "@nextui-org/image";
import { Button } from "@/components/ui/Button";
import { ZoomState } from "@/types";
import { LazyImage } from "@/components/ui/LazyImage";

interface ArtworkZoomProps {
  imageUrl: string;
  title: string;
  artist?: string;
  metadata?: {
    medium?: string;
    dimensions?: string;
    year?: string;
  };
  className?: string;
}

export function ArtworkZoom({
  imageUrl,
  title,
  artist,
  metadata,
  className,
}: ArtworkZoomProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.5, 5),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomState((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / 1.5, 1),
      x: prev.scale <= 1 ? 0 : prev.x,
      y: prev.scale <= 1 ? 0 : prev.y,
    }));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomState({ scale: 1, x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoomState.scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - zoomState.x,
          y: e.clientY - zoomState.y,
        });
      }
    },
    [zoomState],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoomState.scale > 1) {
        setZoomState((prev) => ({
          ...prev,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        }));
      }
    },
    [isDragging, dragStart, zoomState.scale],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomState((prev) => {
      const newScale = Math.min(Math.max(prev.scale * delta, 1), 5);
      return {
        ...prev,
        scale: newScale,
        x: newScale <= 1 ? 0 : prev.x,
        y: newScale <= 1 ? 0 : prev.y,
      };
    });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setZoomState({ scale: 1, x: 0, y: 0 });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomState({ scale: 1, x: 0, y: 0 });
    setIsDragging(false);
  };

  return (
    <>
      <Card
        className={`group cursor-pointer overflow-hidden ${className}`}
        onClick={openModal}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            removeWrapper
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="full"
        classNames={{
          base: "bg-black/95",
          header: "border-b border-gray-700",
          footer: "border-t border-gray-700",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col items-start gap-2">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {artist && (
              <p className="text-brand-500 font-medium">by {artist}</p>
            )}
            {metadata && (
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {metadata.medium && <span>{metadata.medium}</span>}
                {metadata.dimensions && <span>{metadata.dimensions}</span>}
                {metadata.year && <span>{metadata.year}</span>}
              </div>
            )}
          </ModalHeader>

          <ModalBody className="flex-1 flex items-center justify-center p-0 overflow-hidden">
            <div
              className="relative w-full h-full flex items-center justify-center cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{
                cursor:
                  zoomState.scale > 1
                    ? isDragging
                      ? "grabbing"
                      : "grab"
                    : "default",
              }}
            >
              <LazyImage
                ref={imageRef}
                src={imageUrl}
                alt={title}
                width={1000}
                height={800}
                priority
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  transform: `scale(${zoomState.scale}) translate(${zoomState.x / zoomState.scale}px, ${zoomState.y / zoomState.scale}px)`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                }}
                draggable={false}
                fallback={
                  <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center animate-pulse">
                    <div className="w-12 h-12 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              />
            </div>
          </ModalBody>

          <ModalFooter className="justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomState.scale <= 1}
                leftIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                }
              >
                Zoom Out
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomState.scale >= 5}
                leftIcon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Zoom In
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetZoom}
                disabled={
                  zoomState.scale === 1 &&
                  zoomState.x === 0 &&
                  zoomState.y === 0
                }
              >
                Reset
              </Button>
            </div>

            <div className="flex gap-2">
              <span className="text-sm text-gray-400 flex items-center">
                {Math.round(zoomState.scale * 100)}% • Use mouse wheel or
                buttons to zoom
              </span>
              <Button variant="outline" size="sm" onClick={closeModal}>
                Close
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
