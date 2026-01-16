"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Image } from "@nextui-org/image";

import { ToastProvider } from "@/hooks/useToast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";
import { Web3Provider } from "@/components/Web3Provider";
import { Navbar } from "@/components/navbar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
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
              <h1 className="text-3xl font-bold text-white mb-2">
                Application Error
              </h1>
              <p className="text-gray-400 mb-6">
                Something went wrong with the application. Please refresh the
                page to try again.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-violet hover:bg-violet/80 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        <Web3Provider>
          <ToastProvider>
            <PageLoader />
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="w-full py-12">{children}</main>
              <footer className="flex items-center justify-center flex-col p-4">
                <div className="flex flex-col items-center justify-center p-6 gap-3">
                  <Image
                    alt="logo"
                    className="rounded-none"
                    src="/img/logo-white.png"
                    width={150}
                  />
                  <div className="flex flex-col items-center sm:w-[700px] w-full">
                    <p className="text-xs text-white uppercase">
                      All right reserved. 2025.
                    </p>
                    <p className="text-xs text-white uppercase">HoW</p>
                  </div>
                </div>
              </footer>
            </div>
          </ToastProvider>
        </Web3Provider>
      </NextThemesProvider>
    </ErrorBoundary>
  );
}
