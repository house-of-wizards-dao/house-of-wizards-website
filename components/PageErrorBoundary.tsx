import React, { ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageTitle?: string;
  showHomeButton?: boolean;
  customFallback?: ReactNode;
}

export default function PageErrorBoundary({
  children,
  pageTitle = "Page",
  showHomeButton = true,
  customFallback,
}: PageErrorBoundaryProps) {
  if (customFallback) {
    return <ErrorBoundary fallback={customFallback}>{children}</ErrorBoundary>;
  }

  const fallback = (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Error Loading {pageTitle}
          </h2>
          <p className="text-gray-400 mb-6">
            There was an unexpected error loading this page. Please try
            refreshing or return to the homepage.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Page
          </button>

          {showHomeButton && (
            <Link
              href="/"
              className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home size={16} />
              Return Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
