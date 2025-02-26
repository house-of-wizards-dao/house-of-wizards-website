import type { AppProps } from "next/app";

import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient ("https://bdmtbvaqmjiwxbuxflup.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbXRidmFxbWppd3hidXhmbHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTk1NzcsImV4cCI6MjA1NjE3NTU3N30.dYxicIkGHhAiVVr6Y-sIknfTCBNgMjrjh1R3klLN348");

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const RenderedComponent = Component as unknown as React.FC;

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark">
        <SessionContextProvider supabaseClient={supabase}>
        <RenderedComponent {...pageProps} />
        </SessionContextProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
