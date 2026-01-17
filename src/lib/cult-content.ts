/**
 * Cult Content Chronicle parser
 *
 * Fetches and parses the weekly Cult Content Google Doc,
 * converting it to structured markdown items.
 */

const CULT_CONTENT_AUTHOR = "@taniadelrio";
const CULT_CONTENT_DOC_ID = "1vvOX53M3bsXUKgx2WnlbFLSYDuz4R126lCp_qhN9Hk8";

export type CultContentItem = {
  text: string; // markdown formatted content
  date: string; // YYYY-MM-DD format (sync date)
  author: string;
  highlight: boolean;
};

/**
 * Formats a Date as YYYY-MM-DD (ISO 8601)
 */
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Converts @handles to markdown links
 * @username → [@username](https://x.com/username)
 */
const convertHandlesToLinks = (text: string): string => {
  // Match @handle but not if it's already part of a URL
  // Handles can contain letters, numbers, and underscores
  return text.replace(/(?<![\w/])@(\w+)/g, "[@$1](https://x.com/$1)");
};

/**
 * Removes the enumeration prefix from an item
 * "1/ Some text" → "Some text"
 * "12/ Some text" → "Some text"
 */
const stripEnumeration = (text: string): string => {
  return text.replace(/^\d+\/\s*/, "");
};

/**
 * Cleans up URL encoding artifacts
 * &amp; → &
 */
const cleanUrlEncoding = (text: string): string => {
  return text.replace(/&amp;/g, "&");
};

/**
 * Parses the raw Google Doc text into structured items
 */
export const parseCultContent = (rawText: string): CultContentItem[] => {
  const syncDate = formatDate(new Date());
  const chunks = rawText.split(/\+\+/);
  const contentChunks = chunks.slice(1);

  const items: CultContentItem[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    let chunk = contentChunks[i].trim();
    if (!chunk) continue;

    // Check for [highlight] marker and remove it
    const highlight = chunk.includes("[highlight]");
    if (highlight) {
      chunk = chunk.replace(/\[highlight\]/g, "");
    }

    chunk = stripEnumeration(chunk);
    chunk = cleanUrlEncoding(chunk);
    chunk = convertHandlesToLinks(chunk);

    // Normalize whitespace (collapse multiple newlines, trim lines)
    chunk = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");

    if (chunk) {
      items.push({
        text: chunk,
        date: syncDate,
        author: CULT_CONTENT_AUTHOR,
        highlight,
      });
    }
  }

  return items;
};

/**
 * Fetches a Google Doc as plain text using the export URL
 * Requires the doc to have link sharing enabled ("Anyone with the link can view")
 */
export const fetchGoogleDoc = async (): Promise<string> => {
  const exportUrl = `https://docs.google.com/document/d/${CULT_CONTENT_DOC_ID}/export?format=txt`;

  const response = await fetch(exportUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Google Doc: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
};

/**
 * Main function: fetches and parses the Cult Content Google Doc
 * @returns Parsed content items with markdown formatting
 */
export const fetchCultContent = async (): Promise<CultContentItem[]> => {
  const rawText = await fetchGoogleDoc();
  return parseCultContent(rawText);
};
