import type { Metadata } from "next";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import "@/styles/globals.css";

import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={clsx(
          "min-h-screen bg-background text-foreground font-ocra antialiased",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
