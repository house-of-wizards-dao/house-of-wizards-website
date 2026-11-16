"use client";

import Image from "next/image";
import { EmbeddedTweet, type TwitterComponents } from "react-tweet";
import type { Tweet } from "react-tweet/api";

const components: TwitterComponents = {
  MediaImg: (props) => (
    <Image
      {...props}
      alt={props.alt}
      fill
      sizes="(max-width: 640px) calc(100vw - 4rem), (max-width: 1024px) 50vw, 420px"
      loading="lazy"
    />
  ),
  AvatarImg: (props) => <Image {...props} alt={props.alt} loading="lazy" />,
};

/** Tweet data arrives from the server; offscreen media is lazy and responsive. */
export const TweetEmbed = ({ tweet }: { tweet: Tweet }) => (
  <EmbeddedTweet tweet={tweet} components={components} />
);
