import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Calendar, AtSign } from "lucide-react";
import { format, parseISO } from "date-fns";
import { notFound } from "next/navigation";

import {
  fetchCultContentById,
  extractTwitterUrls,
  extractTweetId,
} from "@/lib/server/cult-content";
import { EmbeddedTweet } from "@/components/news/EmbeddedTweet";

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
    return format(date, "MMMM d, yyyy");
  } catch {
    return isoDate;
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  const item = await fetchCultContentById(numericId);

  if (!item) {
    notFound();
  }

  const { display: authorDisplay, href: authorHref } = formatAuthorHandle(
    item.author,
  );
  const formattedDate = formatDate(item.date);
  const twitterUrls = extractTwitterUrls(item.text);
  const tweetIds = twitterUrls
    .map(extractTweetId)
    .filter((id): id is string => id !== null);

  return (
    <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto min-h-screen py-12 px-4">
      <Link href="/" className="self-start text-brand-500 hover:underline mb-4">
        ← Back to chronicle
      </Link>

      <article className="w-full">
        {/* Title */}
        {item.title && (
          <h1 className="sm:text-5xl text-4xl font-heading text-brand-400 mb-4">
            {item.title}
          </h1>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-8">
          <a
            href={authorHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition-colors font-medium"
          >
            <AtSign className="w-4 h-4" />
            {authorDisplay}
          </a>

          <span className="text-neutral-600">•</span>

          <span className="inline-flex items-center gap-1.5 text-neutral-400">
            <Calendar className="w-4 h-4" />
            <time dateTime={item.date}>{formattedDate}</time>
          </span>
        </div>

        {/* Decorative divider */}
        <div className="w-full my-4 mb-8">
          <svg
            className="w-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 330 8"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_453_22)">
              <path
                d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
                fill="transparent"
              />
              <path
                d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
                stroke="#A986D9"
                strokeOpacity="0.5"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <defs>
              <clipPath id="clip0_453_22">
                <rect fill="white" height="8" width="330" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children }) => (
                <p className="mb-4 text-base leading-relaxed">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-brand-500 hover:underline"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt || ""}
                  className="rounded-lg max-w-full my-4"
                  loading="lazy"
                />
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-200">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-base leading-relaxed">{children}</li>
              ),
            }}
          >
            {item.text}
          </ReactMarkdown>
        </div>

        {/* Embedded tweets */}
        {tweetIds.length > 0 && (
          <div className="mt-8 space-y-4">
            {tweetIds.map((tweetId) => (
              <EmbeddedTweet key={tweetId} id={tweetId} />
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
