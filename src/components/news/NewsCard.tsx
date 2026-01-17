import ReactMarkdown from "react-markdown";
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
  const styles = variantStyles[variant];
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
    : truncateText(cleanedText, variant === "small" ? 120 : 200);

  return (
    <article
      className={`
        group relative overflow-hidden
        bg-neutral-900/60 hover:bg-neutral-900/80
        border border-neutral-800/50 hover:border-brand-500/30
        rounded-xl transition-all duration-300
        flex flex-col
        ${variant === "highlight" ? "h-full" : ""}
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
            className={`${styles.textSize} text-neutral-400 leading-relaxed`}
          >
            <ReactMarkdown
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
                  >
                    {children}
                  </a>
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
          <div className="mt-4 space-y-3">
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
