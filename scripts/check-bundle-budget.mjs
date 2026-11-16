import { readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";

// Initial HTML includes the legacy-browser polyfill, making these conservative ceilings.
const routeBudgets = {
  index: 360 * 1024,
  marketplace: 530 * 1024,
  characters: 510 * 1024,
};
let failed = false;
for (const [route, budget] of Object.entries(routeBudgets)) {
  const html = await readFile(`.next/server/app/${route}.html`, "utf8");
  const scripts = [
    ...new Set(
      [
        ...html.matchAll(/<script[^>]+src="(\/_next\/[^"?]+)(?:\?[^" ]*)?"/g),
      ].map((match) => match[1].replace("/_next/", ".next/")),
    ),
  ];
  if (scripts.length === 0)
    throw new Error(
      `No scripts found for ${route}; update the budget reader for this Next.js version.`,
    );
  let size = 0;
  for (const script of scripts) size += gzipSync(await readFile(script)).length;
  console.log(
    `${route}: ${(size / 1024).toFixed(1)} KiB gzip / ${budget / 1024} KiB budget`,
  );
  if (size > budget) failed = true;
}
// Also bound deferred chunks, including transaction SDKs and selected collection browsers.
const chunkBudget = 500 * 1024;
for (const file of await readdir(".next/static/chunks", { recursive: true })) {
  if (!file.endsWith(".js")) continue;
  const size = gzipSync(await readFile(`.next/static/chunks/${file}`)).length;
  if (size > chunkBudget) {
    console.error(
      `${file}: ${(size / 1024).toFixed(1)} KiB gzip exceeds ${chunkBudget / 1024} KiB`,
    );
    failed = true;
  }
}
if (failed) process.exitCode = 1;
