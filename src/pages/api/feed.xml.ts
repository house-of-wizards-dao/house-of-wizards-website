import type { NextApiRequest, NextApiResponse } from "next";
import { getSortedPostsData, getPostData } from "@/lib/posts";
import { siteConfig } from "@/config/site";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the site URL from the request
  const protocol =
    req.headers["x-forwarded-proto"] ||
    (req.headers["x-forwarded-ssl"] === "on" ? "https" : "http");
  const host = req.headers.host || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Get all posts
  const posts = getSortedPostsData();

  // Format date for RSS (RFC 822 format)
  const formatRSSDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00Z");
    return date.toUTCString();
  };

  // Generate RSS XML
  const rssItems = await Promise.all(
    posts.map(async (post) => {
      // Get full post data including content
      const postData = getPostData(post.id);

      // Convert markdown to plain text for description (remove markdown syntax)
      const plainTextContent = postData.content
        ? postData.content
            .replace(/^#+\s+/gm, "") // Remove headers
            .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
            .replace(/\*(.*?)\*/g, "$1") // Remove italic
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links, keep text
            .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // Remove images
            .replace(/\n{3,}/g, "\n\n") // Normalize line breaks
            .trim()
            .substring(0, 500) + (postData.content.length > 500 ? "..." : "")
        : "";

      const postUrl = `${baseUrl}/blog/${post.id}`;
      const pubDate = post.date
        ? formatRSSDate(post.date)
        : new Date().toUTCString();

      // Escape XML special characters in URLs
      const escapeXml = (str: string): string => {
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      };

      return `    <item>
      <title><![CDATA[${post.title || "Untitled"}]]></title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${plainTextContent}]]></description>
    </item>`;
    }),
  );

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteConfig.name} Blog]]></title>
    <link>${baseUrl}/blog</link>
    <description><![CDATA[${siteConfig.description}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
${rssItems.join("\n")}
  </channel>
</rss>`;

  // Set the content type to RSS
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );

  // Return the XML
  return res.status(200).send(rssXml);
}
