/** Shared news card helpers (safe for client and server). */

export const removeTwitterUrls = (text: string): string =>
  text
    .replace(
      /https?:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/\d+[^\s]*(?:\s+[a-zA-Z0-9]{1,5}(?=\s|$))?/g,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};
