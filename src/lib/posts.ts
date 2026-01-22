import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

/**
 * Format a date string consistently for display, avoiding timezone issues.
 * Uses UTC to ensure the same date is displayed on server and client.
 */
export const formatPostDate = (dateString: string): string => {
  // Parse the date string and treat it as UTC to avoid timezone shifts
  // Dates like "2025-11-12" are parsed as UTC midnight
  const date = new Date(dateString + "T00:00:00Z");

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export type PostData = {
  id: string;
  title?: string;
  date?: string;
  formattedDate?: string;
  content?: string;
  [key: string]: unknown;
};

export type Post = {
  id: string;
  title?: string;
  date?: string;
  formattedDate?: string;
  [key: string]: unknown;
};

export const getSortedPostsData = (): Post[] => {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Format the date during static generation to avoid hydration mismatches
    const formattedDate = matterResult.data.date
      ? formatPostDate(matterResult.data.date as string)
      : undefined;

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
      formattedDate,
    } as Post;
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date && b.date) {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    }
    return 0;
  });
};

export const getAllPostIds = (): Array<{ params: { id: string } }> => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPostData = (id: string): PostData => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Format the date during static generation to avoid hydration mismatches
  const formattedDate = matterResult.data.date
    ? formatPostDate(matterResult.data.date as string)
    : undefined;

  // Combine the data with the id
  return {
    id,
    content: matterResult.content,
    ...matterResult.data,
    formattedDate,
  } as PostData;
};
