import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Unified LoadingSpinner Component following the design system
 * Provides consistent loading states across the application
 */

const spinnerVariants = cva(
  // Base spinner styles
  "border-2 border-current border-t-transparent rounded-full animate-spin",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        default: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
      },
      variant: {
        default: "text-brand-500",
        white: "text-white",
        muted: "text-neutral-400",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

const containerVariants = cva("flex items-center justify-center", {
  variants: {
    fullScreen: {
      true: "fixed inset-0 bg-black/50 backdrop-blur-sm z-modal",
      false: "p-4",
    },
  },
  defaultVariants: {
    fullScreen: false,
  },
});

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  message?: string;
  fullScreen?: boolean;
  showMessage?: boolean;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      size = "default",
      variant = "default",
      message = "Loading...",
      fullScreen = false,
      showMessage = true,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(containerVariants({ fullScreen }), className)}
        role="status"
        aria-live="polite"
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={spinnerVariants({ size, variant })}
            aria-hidden="true"
          />
          {showMessage && message && (
            <p className="text-neutral-400 text-sm animate-pulse font-medium">
              {message}
            </p>
          )}
          {/* Screen reader only text */}
          <span className="sr-only">{message}</span>
        </div>
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner, spinnerVariants };
export default LoadingSpinner;
