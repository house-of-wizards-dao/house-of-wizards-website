"use client";

import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { PageTitle } from "@/components/PageTitle";
import {
  breadfriendChannels,
  channelViewsLabel,
  type BreadfriendGif,
} from "@/data/breadfriend";

const sanitizeFilename = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "breadfriend";

const triggerBlobDownload = (blob: Blob, filename: string): void => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoke on a later tick: revoking synchronously can cancel the download in
  // some browsers.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

const downloadButtonClassName =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-500/90 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60";

type BreadfriendCardProps = {
  gif: BreadfriendGif;
};

const BreadfriendCard = ({ gif }: BreadfriendCardProps) => {
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [directDownloadFailed, setDirectDownloadFailed] = useState(false);

  const handleDownload = async (): Promise<void> => {
    setIsDownloading(true);
    const filename = `${sanitizeFilename(gif.title)}.gif`;
    try {
      const response = await fetch(gif.downloadUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const blob = await response.blob();
      triggerBlobDownload(blob, filename);
      toast.success(`Downloaded ${gif.title}`);
    } catch {
      // Cross-origin hosts can block direct fetching. Swap the button for a
      // plain link to the raw media: a real link click is never popup-blocked,
      // unlike window.open() after an await.
      setDirectDownloadFailed(true);
      toast.info(
        `Couldn't download ${gif.title} directly — use "Open GIF" and save it from the new tab.`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-content3/20 bg-content1/40 transition-colors hover:border-brand-500/60">
      <a
        href={gif.pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-square bg-black/40"
        title={`View ${gif.title} on ${gif.platform}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gif.previewUrl}
          alt={gif.title}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </a>

      <div className="flex flex-col gap-3 p-4">
        {/* GIPHY's titles aren't editable at the source, so they are kept as the
            image alt text (accessibility/SEO) but not shown on the card. */}
        <div className="flex items-center gap-2">
          {directDownloadFailed ? (
            <a
              href={gif.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={downloadButtonClassName}
            >
              <ExternalLink className="h-4 w-4" />
              Open GIF
            </a>
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className={downloadButtonClassName}
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading…" : "Download"}
            </button>
          )}
          <a
            href={gif.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-content3/30 px-3 py-2 text-sm transition-colors hover:border-brand-500/60 hover:text-brand-500"
            title={`View on ${gif.platform}`}
            aria-label={`View ${gif.title} on ${gif.platform}`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

type BreadfriendContentProps = {
  gifs: readonly BreadfriendGif[];
};

export const BreadfriendContent = ({ gifs }: BreadfriendContentProps) => {
  return (
    <div className="flex min-h-screen max-w-8xl flex-col items-center gap-4">
      <PageTitle title="Breadfriend" subtitle="My God, I'm delicious!" />

      <div className="flex max-w-7xl flex-col gap-8 p-4 sm:p-0">
        <p className="mx-auto max-w-3xl text-center text-lg">
          The Breadfriend GIF initiative brings everyone&apos;s favourite
          delicious loaf to life across the internet. Browse the collection
          below, download your favourites, or find them on GIPHY and KLIPY to
          drop into your chats and stories.
        </p>

        <div className="flex flex-col items-center gap-1">
          <span className="font-atirose text-5xl text-brand-500">
            {channelViewsLabel}
          </span>
          <span className="font-quad text-xs uppercase tracking-wide text-gray-400">
            All-time GIF views
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {breadfriendChannels.map((channel) => (
            <a
              key={channel.platform}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-content3/30 px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:border-brand-500/60 hover:text-brand-500"
            >
              {channel.label}
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </div>

        {gifs.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-lg border border-dashed border-content3/30 p-8 text-center text-foreground-600">
            <p className="text-lg">The Breadfriend GIFs are rising. 🍞</p>
            <p className="mt-2 text-sm">
              Check back soon, or find them now on the platforms above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {gifs.map((gif) => (
              <BreadfriendCard key={gif.id} gif={gif} />
            ))}
          </div>
        )}

        <p className="text-center font-quad text-xs uppercase tracking-wide text-gray-400">
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-500"
          >
            Powered by GIPHY
          </a>
        </p>
      </div>
    </div>
  );
};
