"use client";

import { EmbeddedTweet } from "react-tweet";
import type { Tweet } from "react-tweet/api";

type TweetEmbedProps = {
  tweet: Tweet;
};

/** Client boundary for react-tweet UI; tweet data is fetched on the server. */
export const TweetEmbed = ({ tweet }: TweetEmbedProps) => (
  <EmbeddedTweet tweet={tweet} />
);
