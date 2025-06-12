import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { ToastProvider } from "@/hooks/useToast";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const RenderedComponent = Component as unknown as React.FC;

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        <SessionContextProvider supabaseClient={supabase}>
          <ToastProvider>
            <RenderedComponent {...pageProps} />
          </ToastProvider>
        </SessionContextProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
