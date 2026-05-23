import { extractTweetId, extractTwitterUrls } from "@/lib/server/cult-content";

export const maxTweetsByVariant = {
  highlight: 2,
  large: 1,
  medium: 1,
  small: 0,
} as const;

export type NewsCardVariant = keyof typeof maxTweetsByVariant;

export const getTweetIdsFromText = (
  text: string,
  maxTweets: number,
): string[] =>
  extractTwitterUrls(text)
    .map(extractTweetId)
    .filter((id): id is string => id !== null)
    .slice(0, maxTweets);

export const getEffectiveVariant = (
  variant: NewsCardVariant,
  hasTitle: boolean,
): NewsCardVariant => (hasTitle && variant === "medium" ? "large" : variant);
