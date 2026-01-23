"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Calendar, AtSign, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";

import {
  CultContentDbItem,
  extractTwitterUrls,
  extractTweetId,
} from "@/lib/server/cult-content";
import { EmbeddedTweet } from "./EmbeddedTweet";

type NewsCardProps = {
  item: CultContentDbItem;
  variant?: "highlight" | "large" | "medium" | "small";
};

/**
 * Formats the author handle for display
 */
function formatAuthorHandle(author: string): {
  display: string;
  href: string;
} {
  const handle = author.startsWith("@") ? author : `@${author}`;
  const username = handle.slice(1);
  return {
    display: handle,
    href: `https://x.com/${username}`,
  };
}

/**
 * Formats ISO 8601 date for display
 */
function formatDate(isoDate: string): string {
  try {
    const date = parseISO(isoDate);
    return format(date, "MMM d, yyyy");
  } catch {
    return isoDate;
  }
}

/**
 * Removes Twitter URLs from text to avoid duplication with embeds
 * Removes the URL plus any query params and broken line continuations
 */
function removeTwitterUrls(text: string): string {
  return (
    text
      // Remove Twitter/X URLs + query params + any broken continuation on next line
      .replace(
        /https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+[^\s]*(?:\s+[a-zA-Z0-9]{1,5}(?=\s|$))?/g,
        "",
      )
      // Clean up whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Truncates text to a certain length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

const variantStyles = {
  highlight: {
    padding: "p-8",
    titleSize: "text-2xl lg:text-3xl",
    textSize: "text-base",
    showFullContent: true,
    maxTweets: 2,
  },
  large: {
    padding: "p-6",
    titleSize: "text-xl",
    textSize: "text-sm",
    showFullContent: true,
    maxTweets: 1,
  },
  medium: {
    padding: "p-5",
    titleSize: "text-lg",
    textSize: "text-sm",
    showFullContent: false,
    maxTweets: 1,
  },
  small: {
    padding: "p-4",
    titleSize: "text-base",
    textSize: "text-sm",
    showFullContent: false,
    maxTweets: 0,
  },
};

export function NewsCard({ item, variant = "medium" }: NewsCardProps) {
  const router = useRouter();

  // Posts with titles should be large (only upgrade from medium, not small/highlight)
  const effectiveVariant =
    item.title && variant === "medium" ? "large" : variant;
  const styles = variantStyles[effectiveVariant];
  const { display: authorDisplay, href: authorHref } = formatAuthorHandle(
    item.author,
  );
  const formattedDate = formatDate(item.date);
  const twitterUrls = extractTwitterUrls(item.text);
  const tweetIds = twitterUrls
    .map(extractTweetId)
    .filter((id): id is string => id !== null)
    .slice(0, styles.maxTweets);
  const cleanedText = removeTwitterUrls(item.text);

  // For smaller cards, truncate the content
  const displayText = styles.showFullContent
    ? cleanedText
    : truncateText(cleanedText, effectiveVariant === "small" ? 120 : 200);

  // Only database items (positive IDs) are linkable
  const isLinkable = item.id > 0;
  const newsUrl = `/news/${item.id}`;

  const handleCardClick = () => {
    if (isLinkable) {
      router.push(newsUrl);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (isLinkable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          router.push(newsUrl);
        }
      }}
      role={isLinkable ? "link" : undefined}
      tabIndex={isLinkable ? 0 : undefined}
      className={`
        group relative overflow-hidden
        bg-neutral-900/60 hover:bg-neutral-900/80
        border border-neutral-800/50 hover:border-brand-500/30
        rounded-xl transition-all duration-300
        flex flex-col
        ${effectiveVariant === "highlight" ? "h-full" : ""}
        ${isLinkable ? "cursor-pointer" : ""}
      `}
    >
      <div className={`${styles.padding} flex flex-col`}>
        {/* Header with meta info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Author */}
            <a
              href={authorHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <AtSign className="w-3 h-3" />
              {authorDisplay}
            </a>

            <span className="text-neutral-600">•</span>

            {/* Date */}
            <span className="inline-flex items-center gap-1 text-neutral-500">
              <Calendar className="w-3 h-3" />
              <time dateTime={item.date}>{formattedDate}</time>
            </span>
          </div>

          {/* External link indicator */}
          {tweetIds.length > 0 && (
            <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-brand-500/50 transition-colors" />
          )}
        </div>

        {/* Optional title */}
        {item.title && (
          <h3
            className={`${styles.titleSize} font-semibold text-neutral-100 mb-3 font-heading leading-tight group-hover:text-brand-300 transition-colors`}
          >
            {item.title}
          </h3>
        )}

        {/* Content */}
        {displayText && (
          <div
            className={`${styles.textSize} text-neutral-400 leading-relaxed [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-2 [&_audio]:w-full [&_audio]:my-2 [&_video]:w-full [&_video]:rounded-lg [&_video]:my-2`}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-brand-400 hover:text-brand-300 hover:underline transition-colors"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={alt || ""}
                    className="rounded-lg max-w-full my-2"
                    loading="lazy"
                  />
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-neutral-200">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-neutral-300">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {displayText}
            </ReactMarkdown>
          </div>
        )}

        {/* Embedded tweets */}
        {tweetIds.length > 0 && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div className="mt-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            {tweetIds.map((tweetId) => (
              <EmbeddedTweet key={tweetId} id={tweetId} />
            ))}
          </div>
        )}
      </div>

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500/50 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}
