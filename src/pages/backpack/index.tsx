import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DefaultLayout from "@/layouts/default";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Web3Provider } from "@/components/Web3Provider";
import WizardBrowser from "@/components/WizardBrowser";

export default function PfpPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <DefaultLayout>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center">
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
                  Error Loading Page
                </h2>
                <p className="text-gray-400 mb-6">
                  There was an error loading the wizards page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }
      >
        <Web3Provider>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Forgotten Runes Wizards
              </h1>
              {isClient && <ConnectButton />}
            </div>
            {isClient && (
              <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
                <WizardBrowser />
              </div>
            )}
          </div>
        </Web3Provider>
      </ErrorBoundary>
    </DefaultLayout>
  );
}
