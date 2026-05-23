import type { CultContentDbItem } from "@/lib/server/cult-content";
import {
  getEffectiveVariant,
  getTweetIdsFromText,
  maxTweetsByVariant,
  type NewsCardVariant,
} from "@/lib/server/news-tweets";

import { EmbeddedTweets } from "./EmbeddedTweets";
import { NewsCard } from "./NewsCard";

type NewsCardWithTweetsProps = {
  item: CultContentDbItem;
  variant?: NewsCardVariant;
};

export const NewsCardWithTweets = ({
  item,
  variant = "medium",
}: NewsCardWithTweetsProps) => {
  const effectiveVariant = getEffectiveVariant(variant, Boolean(item.title));
  const tweetIds = getTweetIdsFromText(
    item.text,
    maxTweetsByVariant[effectiveVariant],
  );

  return (
    <NewsCard
      item={item}
      variant={variant}
      embeddedTweets={
        tweetIds.length > 0 ? <EmbeddedTweets ids={tweetIds} /> : undefined
      }
      hasEmbeddedTweets={tweetIds.length > 0}
    />
  );
};
