import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorBoundary from "@/components/ErrorBoundary";
import Web3ErrorBoundary from "@/components/Web3ErrorBoundary";

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Component that throws Web3-specific errors
const ThrowWeb3Error = ({
  shouldThrow,
  errorType = "generic",
}: {
  shouldThrow: boolean;
  errorType?: string;
}) => {
  if (shouldThrow) {
    const errorMessages = {
      connection: "wallet connection failed",
      network: "network error occurred",
      transaction: "user rejected transaction",
      contract: "contract revert error",
      generic: "generic web3 error",
    };
    throw new Error(
      errorMessages[errorType as keyof typeof errorMessages] || "generic error",
    );
  }
  return <div>No Web3 error</div>;
};

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders error UI when there is an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We encountered an unexpected error. Please try refreshing the page.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Refresh Page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try Again" }),
    ).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Error Details (Development)")).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it("resets error state when Try Again is clicked", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ErrorBoundary resetOnPropsChange>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try Again" }));

    rerender(
      <ErrorBoundary resetOnPropsChange>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });
});

describe("Web3ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when there is no error", () => {
    render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={false} />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("No Web3 error")).toBeInTheDocument();
  });

  it("categorizes wallet connection errors correctly", () => {
    render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={true} errorType="connection" />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Wallet Connection Error")).toBeInTheDocument();
    expect(screen.getByText("Retry Connection")).toBeInTheDocument();
  });

  it("categorizes network errors correctly", () => {
    render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={true} errorType="network" />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Network Error")).toBeInTheDocument();
    expect(screen.getByText("Check Network")).toBeInTheDocument();
  });

  it("categorizes transaction errors correctly", () => {
    render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={true} errorType="transaction" />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Transaction Error")).toBeInTheDocument();
  });

  it("categorizes contract errors correctly", () => {
    render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={true} errorType="contract" />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Smart Contract Error")).toBeInTheDocument();
  });

  it("handles generic Web3 errors", () => {
    render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={true} errorType="generic" />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Web3 Error")).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const customFallback = <div>Custom Web3 error</div>;

    render(
      <Web3ErrorBoundary fallback={customFallback}>
        <ThrowWeb3Error shouldThrow={true} />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Custom Web3 error")).toBeInTheDocument();
  });

  it("calls onError callback when error occurs", () => {
    const onError = jest.fn();

    render(
      <Web3ErrorBoundary onError={onError}>
        <ThrowWeb3Error shouldThrow={true} />
      </Web3ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      }),
    );
  });

  it("resets error state when Try Again is clicked", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={true} />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("Web3 Error")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try Again" }));

    rerender(
      <Web3ErrorBoundary>
        <ThrowWeb3Error shouldThrow={false} />
      </Web3ErrorBoundary>,
    );

    expect(screen.getByText("No Web3 error")).toBeInTheDocument();
  });
});
