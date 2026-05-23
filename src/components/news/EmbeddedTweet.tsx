import { getTweet } from "react-tweet/api";
import { TweetNotFound } from "react-tweet";
import "react-tweet/theme.css";

import { normalizeTweet } from "@/lib/twitter/normalize-tweet";

import { TweetEmbed } from "./TweetEmbed";

type EmbeddedTweetProps = {
  id: string;
};

export const EmbeddedTweet = async ({ id }: EmbeddedTweetProps) => {
  const raw = await getTweet(id);

  if (!raw || raw.__typename !== "Tweet") {
    return <TweetNotFound />;
  }

  return (
    <div className="rounded-xl overflow-hidden [&>div]:!max-w-full [&_.react-tweet-theme]:!max-w-full">
      <TweetEmbed tweet={normalizeTweet(raw)} />
    </div>
  );
};
