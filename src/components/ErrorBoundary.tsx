import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  isolate?: boolean; // If true, prevents error from bubbling to parent error boundaries
}

interface State {
  hasError: boolean;
  error?: Error;
  eventId?: string; // For error tracking
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Generate a unique event ID for this error
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, eventId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to our logging system
    console.error("React Error Boundary caught an error", {
      error,
      errorMessage: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      eventId: this.state.eventId,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      timestamp: new Date().toISOString(),
    });

    // Note: Error isolation would need to be handled at the component level
    // The isolate prop can be used by parent components to make decisions
    // about error handling, but errors in React don't have stopPropagation

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    // Reset error state when props change (if resetOnPropsChange is enabled)
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps.children !== this.props.children
    ) {
      this.setState({ hasError: false, error: undefined, eventId: undefined });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, eventId: undefined });
  };

  private handleReportError = () => {
    if (this.state.error && this.state.eventId) {
      // Create a simple error report
      const errorReport = {
        eventId: this.state.eventId,
        message: this.state.error.message,
        stack: this.state.error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Copy to clipboard
      navigator.clipboard
        .writeText(JSON.stringify(errorReport, null, 2))
        .then(() => alert("Error report copied to clipboard"))
        .catch(() => console.log("Error report:", errorReport));
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Please try refreshing the
                page.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>

              {process.env.NODE_ENV === "development" && (
                <button
                  onClick={this.handleReportError}
                  className="w-full border border-blue-600 hover:border-blue-500 text-blue-300 hover:text-blue-200 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Copy Error Report
                </button>
              )}
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-gray-900 rounded-lg">
                    <p className="text-xs text-blue-400 mb-2">
                      Event ID: {this.state.eventId}
                    </p>
                    <p className="text-xs text-yellow-400 mb-2">
                      Error: {this.state.error.name}
                    </p>
                    <p className="text-xs text-red-400">
                      Message: {this.state.error.message}
                    </p>
                  </div>
                  {this.state.error.stack && (
                    <pre className="p-4 bg-gray-900 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {this.state.eventId && (
              <p className="mt-4 text-xs text-gray-500 text-center">
                Error ID: {this.state.eventId}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
