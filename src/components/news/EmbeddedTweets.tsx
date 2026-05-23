import { Suspense } from "react";
import { TweetSkeleton } from "react-tweet";

import { EmbeddedTweet } from "./EmbeddedTweet";

type EmbeddedTweetsProps = {
  ids: string[];
};

export const EmbeddedTweets = ({ ids }: EmbeddedTweetsProps) => (
  <>
    {ids.map((id) => (
      <Suspense key={id} fallback={<TweetSkeleton />}>
        <EmbeddedTweet id={id} />
      </Suspense>
    ))}
  </>
);
