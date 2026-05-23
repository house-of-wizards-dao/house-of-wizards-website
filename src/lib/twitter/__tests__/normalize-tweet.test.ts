import type { Tweet } from "react-tweet/api";

import { normalizeTweet } from "../normalize-tweet";

const baseTweet = {
  __typename: "Tweet",
  lang: "en",
  created_at: "2025-01-01T00:00:00.000Z",
  display_text_range: [0, 10] as [number, number],
  id_str: "1",
  text: "hello world",
  user: {
    id_str: "1",
    name: "User",
    screen_name: "user",
    profile_image_url_https: "https://example.com/avatar.jpg",
    profile_image_shape: "Circle",
    verified: false,
    is_blue_verified: false,
  },
  edit_control: {
    edit_tweet_ids: ["1"],
    editable_until_msecs: "0",
    edits_remaining: "5",
    is_edit_eligible: true,
  },
  isEdited: false,
  isStaleEdit: false,
  favorite_count: 0,
  conversation_count: 0,
  news_action_type: "conversation" as const,
} satisfies Omit<Tweet, "entities">;

describe("normalizeTweet", () => {
  it("fills missing urls and symbols arrays", () => {
    const tweet = normalizeTweet({
      ...baseTweet,
      entities: {
        hashtags: [{ indices: [0, 4], text: "test" }],
        user_mentions: [],
      } as unknown as Tweet["entities"],
    });

    expect(tweet.entities.urls).toEqual([]);
    expect(tweet.entities.symbols).toEqual([]);
    expect(tweet.entities.hashtags).toHaveLength(1);
  });
});
