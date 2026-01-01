"use client";

import { useState, useRef, useEffect, forwardRef, type ReactNode, type ForwardedRef } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps extends Omit<ImageProps, "loading"> {
  threshold?: number;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
  priority?: boolean;
}

/**
 * Optimized lazy loading image component with intersection observer
 * Provides better performance for image-heavy pages
 */
export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  (
    {
      className,
      threshold = 0.1,
      fallback,
      errorFallback,
      alt,
      priority = false,
      ...props
    }: LazyImageProps,
    ref: ForwardedRef<HTMLImageElement>,
  ) => {
    const [isIntersecting, setIsIntersecting] = useState(priority);
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Skip intersection observer if priority loading is enabled
      if (priority) {
        setIsIntersecting(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observer.disconnect();
          }
        },
        { threshold },
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [threshold, priority]);

    const handleError = () => {
      setHasError(true);
    };

    const handleLoad = () => {
      setIsLoaded(true);
    };

    if (hasError && errorFallback) {
      return <>{errorFallback}</>;
    }

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {!isIntersecting && fallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
            {fallback}
          </div>
        )}
        {isIntersecting && (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <Image
              {...props}
              ref={ref}
              alt={alt}
              className={cn("transition-opacity duration-300", {
                "opacity-0": !isLoaded,
                "opacity-100": isLoaded,
              })}
              onError={handleError}
              onLoad={handleLoad}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
          </>
        )}
      </div>
    );
  },
);

LazyImage.displayName = "LazyImage";
