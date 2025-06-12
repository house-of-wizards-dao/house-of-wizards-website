import React from "react";
import { Spinner } from "@nextui-org/spinner";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const spinnerSizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClass = fullScreen
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    : "flex items-center justify-center p-4";

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex flex-col items-center gap-2">
        <Spinner
          className={spinnerSizes[size]}
          color="default"
          labelColor="foreground"
        />
        {message && (
          <p className="text-gray-400 text-sm animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
