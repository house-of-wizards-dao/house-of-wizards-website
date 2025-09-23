import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

import { ToastProvider } from "@/hooks/useToast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const RenderedComponent = Component as unknown as React.FC;

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
      <NextUIProvider navigate={router.push}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <ToastProvider>
            <PageLoader />
            <RenderedComponent {...pageProps} />
          </ToastProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </ErrorBoundary>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
