"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";

export type Toast = {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
  onRetry?: () => void;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (
    message: string,
    title?: string,
    duration?: number,
    onRetry?: () => void,
  ) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

type ToastProviderProps = {
  children: ReactNode;
};

export const ToastProvider = ({
  children,
}: ToastProviderProps): JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration (default 5 seconds)
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "success", message, title, duration });
    },
    [addToast],
  );

  const error = useCallback(
    (
      message: string,
      title?: string,
      duration?: number,
      onRetry?: () => void,
    ) => {
      addToast({ type: "error", message, title, duration, onRetry });
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "warning", message, title, duration });
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      addToast({ type: "info", message, title, duration });
    },
    [addToast],
  );

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

type ToastContainerProps = {
  toasts: Toast[];
  onRemove: (id: string) => void;
};

const ToastContainer = ({
  toasts,
  onRemove,
}: ToastContainerProps): JSX.Element => {
  if (toasts.length === 0) {
    return <></>;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-top-2 fade-in duration-300"
        >
          {toast.type === "success" ? (
            <SuccessMessage
              title={toast.title}
              message={toast.message}
              onDismiss={() => onRemove(toast.id)}
            />
          ) : (
            <ErrorMessage
              title={toast.title}
              message={toast.message}
              variant={
                toast.type === "error"
                  ? "error"
                  : toast.type === "warning"
                    ? "warning"
                    : "info"
              }
              onDismiss={() => onRemove(toast.id)}
              onRetry={toast.onRetry}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Utility function to use toasts outside of components (for API calls, etc.)
let toastInstance: ToastContextType | null = null;

export const setToastInstance = (instance: ToastContextType): void => {
  toastInstance = instance;
};

export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    toastInstance?.success(message, title, duration);
  },
  error: (
    message: string,
    title?: string,
    duration?: number,
    onRetry?: () => void,
  ) => {
    toastInstance?.error(message, title, duration, onRetry);
  },
  warning: (message: string, title?: string, duration?: number) => {
    toastInstance?.warning(message, title, duration);
  },
  info: (message: string, title?: string, duration?: number) => {
    toastInstance?.info(message, title, duration);
  },
};
