"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Wallet } from "lucide-react";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorType?: "connection" | "transaction" | "contract" | "network" | "generic";
}

export default class Web3ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Categorize Web3 errors
    let errorType: State["errorType"] = "generic";

    if (
      error.message.includes("user rejected") ||
      error.message.includes("denied")
    ) {
      errorType = "transaction";
    } else if (
      error.message.includes("network") ||
      error.message.includes("chain")
    ) {
      errorType = "network";
    } else if (
      error.message.includes("contract") ||
      error.message.includes("revert")
    ) {
      errorType = "contract";
    } else if (
      error.message.includes("wallet") ||
      error.message.includes("connect")
    ) {
      errorType = "connection";
    }

    return { hasError: true, error, errorType };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log Web3 errors with additional context
    logger.error("Web3 Error Boundary caught an error", {
      error,
      errorMessage: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: "Web3ErrorBoundary",
      errorType: this.state.errorType,
      web3Context: true,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    // Reset error state when children change
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({
        hasError: false,
        error: undefined,
        errorType: undefined,
      });
    }
  }

  private getErrorContent() {
    const { errorType, error } = this.state;

    switch (errorType) {
      case "connection":
        return {
          icon: <Wallet className="w-8 h-8 text-blue-500" />,
          title: "Wallet Connection Error",
          description:
            "There was an issue connecting to your wallet. Please check your wallet extension and try again.",
          actions: [
            {
              label: "Retry Connection",
              onClick: () =>
                this.setState({ hasError: false, error: undefined }),
              primary: true,
            },
            {
              label: "Refresh Page",
              onClick: () => window.location.reload(),
              primary: false,
            },
          ],
        };

      case "network":
        return {
          icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
          title: "Network Error",
          description:
            "Please check your network connection and ensure you're connected to the correct blockchain network.",
          actions: [
            {
              label: "Check Network",
              onClick: () =>
                this.setState({ hasError: false, error: undefined }),
              primary: true,
            },
            {
              label: "Refresh Page",
              onClick: () => window.location.reload(),
              primary: false,
            },
          ],
        };

      case "transaction":
        return {
          icon: <RefreshCw className="w-8 h-8 text-yellow-500" />,
          title: "Transaction Error",
          description:
            "The transaction was rejected or failed. This is usually because you cancelled it or there was insufficient gas.",
          actions: [
            {
              label: "Try Again",
              onClick: () =>
                this.setState({ hasError: false, error: undefined }),
              primary: true,
            },
          ],
        };

      case "contract":
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
          title: "Smart Contract Error",
          description:
            "There was an issue interacting with the smart contract. This could be due to insufficient funds, invalid parameters, or contract restrictions.",
          actions: [
            {
              label: "Try Again",
              onClick: () =>
                this.setState({ hasError: false, error: undefined }),
              primary: true,
            },
            {
              label: "Refresh Page",
              onClick: () => window.location.reload(),
              primary: false,
            },
          ],
        };

      default:
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
          title: "Web3 Error",
          description:
            "An unexpected error occurred while interacting with the blockchain. Please try again.",
          actions: [
            {
              label: "Try Again",
              onClick: () =>
                this.setState({ hasError: false, error: undefined }),
              primary: true,
            },
            {
              label: "Refresh Page",
              onClick: () => window.location.reload(),
              primary: false,
            },
          ],
        };
    }
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { icon, title, description, actions } = this.getErrorContent();

      // Default Web3 error UI
      return (
        <div className="min-h-[300px] flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700">
                {icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-400 mb-6">{description}</p>
            </div>

            <div className="space-y-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
                    action.primary
                      ? "bg-violet hover:bg-violet/80 text-white"
                      : "border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-gray-900 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {"\n\n"}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
