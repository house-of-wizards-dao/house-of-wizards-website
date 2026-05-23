import type { QuotedTweet, Tweet, TweetEntities } from "react-tweet/api";

const normalizeEntities = (entities: TweetEntities): TweetEntities => ({
  hashtags: entities.hashtags ?? [],
  urls: entities.urls ?? [],
  user_mentions: entities.user_mentions ?? [],
  symbols: entities.symbols ?? [],
  ...(entities.media ? { media: entities.media } : {}),
});

const normalizeQuotedTweet = (tweet: QuotedTweet): QuotedTweet => ({
  ...tweet,
  entities: normalizeEntities(tweet.entities),
});

/** Ensures entity arrays exist for react-tweet's enrichTweet (X API omits empty arrays). */
export const normalizeTweet = (tweet: Tweet): Tweet => ({
  ...tweet,
  entities: normalizeEntities(tweet.entities),
  quoted_tweet: tweet.quoted_tweet
    ? normalizeQuotedTweet(tweet.quoted_tweet)
    : undefined,
});
