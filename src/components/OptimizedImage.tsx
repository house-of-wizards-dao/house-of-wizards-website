import React, { useState, memo } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

const OptimizedImage = memo<OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className = "",
    fallbackSrc = "/img/logo.png",
    priority = false,
    quality = 75,
    placeholder = "empty",
    blurDataURL,
  }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
        setHasError(true);
      }
    };

    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        style={{
          objectFit: "cover",
        }}
      />
    );
  },
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
