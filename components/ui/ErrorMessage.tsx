import React from "react";
import { AlertTriangle, X, RefreshCw, Info } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const errorMessageVariants = cva(
  "flex items-start gap-3 p-4 rounded-lg border",
  {
    variants: {
      variant: {
        error:
          "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300",
        warning:
          "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-300",
        info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  },
);

interface ErrorMessageProps extends VariantProps<typeof errorMessageVariants> {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onDismiss,
  onRetry,
  variant = "error",
  className,
}) => {
  const getIcon = () => {
    switch (variant) {
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={cn(errorMessageVariants({ variant }), className)}
      role="alert"
      aria-live="polite"
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        <p className="text-sm">{message}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            aria-label="Retry"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Try again"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
          </button>
        )}

        {onDismiss && (
          <button
            aria-label="Dismiss"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Dismiss"
            onClick={onDismiss}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

ErrorMessage.displayName = "ErrorMessage";

export { ErrorMessage, errorMessageVariants };
export default ErrorMessage;
