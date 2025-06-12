import React from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  variant?: "error" | "warning" | "info";
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onDismiss,
  onRetry,
  variant = "error",
  className = "",
}) => {
  const variants = {
    error: {
      container: "bg-red-900 border-red-700 text-red-200",
      icon: "text-red-400",
      button: "text-red-300 hover:text-red-100",
    },
    warning: {
      container: "bg-yellow-900 border-yellow-700 text-yellow-200",
      icon: "text-yellow-400",
      button: "text-yellow-300 hover:text-yellow-100",
    },
    info: {
      container: "bg-blue-900 border-blue-700 text-blue-200",
      icon: "text-blue-400",
      button: "text-blue-300 hover:text-blue-100",
    },
  };

  const variantStyles = variants[variant];

  return (
    <div
      className={`p-4 border rounded-lg ${variantStyles.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`h-5 w-5 mt-0.5 flex-shrink-0 ${variantStyles.icon}`}
        />

        <div className="flex-1 min-w-0">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <button
              aria-label="Retry"
              className={`p-1 rounded hover:bg-opacity-20 transition-colors ${variantStyles.button}`}
              title="Try again"
              onClick={onRetry}
            >
              <RefreshCw size={16} />
            </button>
          )}

          {onDismiss && (
            <button
              aria-label="Dismiss"
              className={`p-1 rounded hover:bg-opacity-20 transition-colors ${variantStyles.button}`}
              title="Dismiss"
              onClick={onDismiss}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
