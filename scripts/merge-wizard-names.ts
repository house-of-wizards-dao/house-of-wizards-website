/**
 * Script to merge wizardNames into wizardsWithTraits
 * Run with: npx tsx scripts/merge-wizard-names.ts
 */

import { wizardsWithTraits } from "../src/data/wizardsWithTraits";
import { wizardNames } from "../src/data/wizardNames";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build a lookup map from wizardNames
const namesMap = new Map<
  number,
  { title: string; firstName: string; location: string }
>();

for (const nameEntry of wizardNames) {
  namesMap.set(nameEntry.idx, {
    title: nameEntry.title,
    firstName: nameEntry.firstName,
    location: nameEntry.location,
  });
}

// Merge the data
const mergedWizards = wizardsWithTraits.map((wizard) => {
  const nameData = namesMap.get(wizard.idx);
  return {
    idx: wizard.idx,
    name: wizard.name,
    background: wizard.background,
    body: wizard.body,
    familiar: wizard.familiar,
    head: wizard.head,
    prop: wizard.prop,
    rune: wizard.rune,
    title: nameData?.title || "",
    firstName: nameData?.firstName || "",
    origin: nameData?.location || "",
  };
});

// Generate the output file content
const outputContent = `export type Wizard = {
  idx: number;
  name: string;
  background: number;
  body: number;
  familiar: number;
  head: number;
  prop: number;
  rune: number;
  title: string;
  firstName: string;
  origin: string;
};

export const wizardsWithTraits: Wizard[] = ${JSON.stringify(mergedWizards, null, 2)
  .replace(/"(\w+)":/g, "$1:")  // Remove quotes from keys
  .replace(/: ""/g, ': ""')    // Keep empty strings
};
`;

// Write to file
const outputPath = path.join(__dirname, "../src/data/wizardsWithTraits.ts");
fs.writeFileSync(outputPath, outputContent, "utf-8");

console.log(`✅ Successfully merged ${wizardNames.length} wizard names into wizardsWithTraits.ts`);
console.log(`   Total wizards: ${mergedWizards.length}`);
console.log(`   Output: ${outputPath}`);

