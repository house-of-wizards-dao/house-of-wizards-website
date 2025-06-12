import React from "react";
import { Check, X } from "lucide-react";

interface SuccessMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  onDismiss,
  className = "",
}) => {
  return (
    <div
      className={`p-4 border rounded-lg bg-green-900 border-green-700 text-green-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Check
          className="h-5 w-5 mt-0.5 flex-shrink-0 text-green-400"
        />

        <div className="flex-1 min-w-0">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>

        {onDismiss && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              aria-label="Dismiss"
              className="p-1 rounded hover:bg-opacity-20 transition-colors text-green-300 hover:text-green-100"
              title="Dismiss"
              onClick={onDismiss}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessMessage;