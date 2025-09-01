import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

import type { Auction, AuctionTimer } from "@/types";

interface AuctionHeroProps {
  auction: Auction;
  timer: AuctionTimer;
  className?: string;
}

export function AuctionHero({ auction, timer, className }: AuctionHeroProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const maxZoom = 4;
  const minZoom = 1;
  const zoomStep = 0.5;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - zoomStep, minZoom));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panPosition.x,
      y: e.clientY - panPosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;

    const container = imageRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const maxPanX = (rect.width * (zoomLevel - 1)) / 2;
    const maxPanY = (rect.height * (zoomLevel - 1)) / 2;

    const newX = Math.max(-maxPanX, Math.min(maxPanX, e.clientX - dragStart.x));
    const newY = Math.max(-maxPanY, Math.min(maxPanY, e.clientY - dragStart.y));

    setPanPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta));

    if (newZoom === minZoom) {
      setPanPosition({ x: 0, y: 0 });
    }

    setZoomLevel(newZoom);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;

      switch (e.key) {
        case "Escape":
          setIsZoomed(false);
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleZoomReset();
          break;
      }
    };

    if (isZoomed) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isZoomed, zoomLevel]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "ended":
        return "text-red-400";
      case "upcoming":
        return "text-yellow-400";
      default:
        return "text-neutral-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Live Auction";
      case "ended":
        return "Auction Ended";
      case "upcoming":
        return "Upcoming Auction";
      default:
        return "Unknown Status";
    }
  };

  return (
    <>
      <div
        className={`relative w-full h-[70vh] min-h-[600px] overflow-hidden ${className}`}
      >
        {/* Background Artwork */}
        <div className="absolute inset-0">
          <Image
            src={auction.artwork_url}
            alt={auction.title}
            loading="lazy"
            className="w-full h-full object-cover"
            classNames={{
              img: "opacity-40 blur-sm scale-110",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              {/* Artwork Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <Card className="bg-black/20 backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={auction.artwork_url}
                      alt={auction.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onLoad={() => setImageLoaded(true)}
                    />

                    {/* Zoom Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        isIconOnly
                        size="lg"
                        className="bg-white/90 text-black hover:bg-white transition-all duration-300 transform hover:scale-110"
                        onPress={() => setIsZoomed(true)}
                      >
                        <ArrowsPointingOutIcon className="w-6 h-6" />
                      </Button>
                    </div>

                    {/* Loading State */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-neutral-800 animate-pulse flex items-center justify-center">
                        <div className="text-neutral-500">
                          Loading artwork...
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Auction Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                      auction.status === "active"
                        ? "border-green-400/30 bg-green-400/10"
                        : auction.status === "ended"
                          ? "border-red-400/30 bg-red-400/10"
                          : "border-yellow-400/30 bg-yellow-400/10"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        auction.status === "active"
                          ? "bg-green-400 animate-pulse"
                          : auction.status === "ended"
                            ? "bg-red-400"
                            : "bg-yellow-400 animate-pulse"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${getStatusColor(auction.status)}`}
                    >
                      {getStatusText(auction.status)}
                    </span>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-heading text-white leading-tight">
                    {auction.title}
                  </h1>
                  {auction.description && (
                    <p className="text-lg text-neutral-300 leading-relaxed max-w-xl">
                      {auction.description}
                    </p>
                  )}
                </div>

                {/* Artist Credit */}
                {auction.artist && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-semibold">
                      {auction.artist.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-neutral-400 text-sm">Created by</p>
                      <p className="text-white font-medium text-lg">
                        {auction.artist.name}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-modal flex items-center justify-center"
            onClick={() => setIsZoomed(false)}
          >
            {/* Zoom Controls */}
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <Button
                isIconOnly
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                onPress={handleZoomOut}
                isDisabled={zoomLevel <= minZoom}
              >
                <MagnifyingGlassMinusIcon className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                onPress={handleZoomReset}
              >
                <span className="text-sm font-medium">
                  {Math.round(zoomLevel * 100)}%
                </span>
              </Button>
              <Button
                isIconOnly
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                onPress={handleZoomIn}
                isDisabled={zoomLevel >= maxZoom}
              >
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
              </Button>
              <Button
                isIconOnly
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                onPress={() => setIsZoomed(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Zoomable Image */}
            <motion.div
              ref={imageRef}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-[90vw] max-h-[90vh] cursor-grab active:cursor-grabbing overflow-hidden"
              style={{
                cursor: isDragging
                  ? "grabbing"
                  : zoomLevel > 1
                    ? "grab"
                    : "default",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={auction.artwork_url}
                alt={auction.title}
                loading="lazy"
                className="w-full h-full object-contain select-none"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                }}
                draggable={false}
              />
            </motion.div>

            {/* Zoom Instructions */}
            <div className="absolute bottom-6 left-6 text-white/60 text-sm">
              <p>Scroll to zoom • Drag to pan • Press ESC to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
