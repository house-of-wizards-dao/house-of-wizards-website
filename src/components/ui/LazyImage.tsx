"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useCallback,
  type ReactNode,
  type ForwardedRef,
} from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps extends Omit<ImageProps, "loading"> {
  threshold?: number;
  fallback?: ReactNode | null; // null to disable default fallback
  errorFallback?: ReactNode | null; // null to disable default error fallback
  priority?: boolean;
  containerClassName?: string; // Optional className for the container div
}

/**
 * Optimized lazy loading image component with intersection observer
 * Provides better performance for image-heavy pages
 */
// Default fallback component (transparent with animation)
const DefaultFallback = ({
  width,
  height,
}: {
  width?: number | string;
  height?: number | string;
}) => (
  <div
    className="absolute inset-0 flex items-center justify-center bg-transparent"
    style={{ width, height }}
  >
    <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

/**
 * Optimized lazy loading image component with intersection observer
 * - Default transparent fallback with spinner animation
 * - Default error fallback with icon
 * - Smooth fade-in on load
 * - Easy to use: just pass src, alt, width, height
 */
// Default error fallback component
const DefaultErrorFallback = ({
  alt,
  width,
  height,
}: {
  alt?: string;
  width?: number | string;
  height?: number | string;
}) => (
  <div
    className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800"
    style={{ width, height }}
  >
    <div className="text-gray-400 text-sm text-center p-4">
      <svg
        className="w-12 h-12 mx-auto mb-2 text-gray-400"
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
      <p>Failed to load image</p>
      {alt && <p className="text-xs mt-1">{alt}</p>}
    </div>
  </div>
);

export const LazyImage = forwardRef<HTMLImageElement, LazyImageProps>(
  (
    {
      className, // Applied to the Image component
      containerClassName, // Applied to the container div
      threshold = 0.1,
      fallback = undefined, // undefined = use default, null = no fallback
      errorFallback = undefined, // undefined = use default, null = no error fallback
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

    const handleError = useCallback(() => {
      setHasError(true);
    }, []);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
    }, []);

    // Show error fallback if error occurred
    if (hasError) {
      if (errorFallback === null) {
        // Explicitly disabled, return nothing
        return null;
      }
      if (errorFallback !== undefined) {
        // Custom error fallback provided
        return <>{errorFallback}</>;
      }
      // Use default error fallback
      const errorContainerStyle =
        props.width && props.height
          ? { width: props.width, height: props.height }
          : undefined;

      return (
        <div
          ref={containerRef}
          className={cn("relative", containerClassName)}
          style={errorContainerStyle}
        >
          <DefaultErrorFallback
            alt={alt}
            width={props.width}
            height={props.height}
          />
        </div>
      );
    }

    // Determine which fallback to show
    const showFallback = !isIntersecting || !isLoaded;
    const shouldShowFallback = showFallback && fallback !== null;
    const fallbackContent =
      fallback !== undefined && fallback !== null ? (
        fallback
      ) : (
        <DefaultFallback width={props.width} height={props.height} />
      );

    // Ensure container has same dimensions as image to prevent layout shift
    const containerStyle =
      props.width && props.height
        ? { width: props.width, height: props.height }
        : undefined;

    return (
      <div
        ref={containerRef}
        className={cn("relative", containerClassName)}
        style={containerStyle}
      >
        {shouldShowFallback && fallbackContent}
        {isIntersecting && (
          <Image
            {...props}
            ref={ref}
            alt={alt}
            className={cn("transition-opacity duration-300", className, {
              "opacity-0": !isLoaded,
              "opacity-100": isLoaded,
            })}
            onError={handleError}
            onLoad={handleLoad}
            priority={priority}
          />
        )}
      </div>
    );
  },
);

LazyImage.displayName = "LazyImage";
