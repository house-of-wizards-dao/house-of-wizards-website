"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/spinner";

// Dynamically import Tweet with no SSR to avoid RSC bundler issues
const Tweet = dynamic(
  () => import("react-tweet").then((mod) => mod.Tweet),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
        <Spinner size="sm" color="secondary" />
      </div>
    ),
  },
);

type EmbeddedTweetProps = {
  id: string;
};

export function EmbeddedTweet({ id }: EmbeddedTweetProps) {
  return (
    <div className="rounded-xl overflow-hidden [&>div]:!max-w-full [&_.react-tweet-theme]:!max-w-full">
      <Tweet id={id} />
    </div>
  );
}

