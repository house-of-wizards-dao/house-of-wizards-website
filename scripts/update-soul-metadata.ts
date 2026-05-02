/**
 * Add or refresh one Forgotten Soul in the local data files.
 *
 * Run with: pnpm tsx scripts/update-soul-metadata.ts <token-id>
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  soulsMetadataMap,
  type SoulMetadata,
} from "../src/data/soulsMetadataMap";
import {
  soulTraitParts,
  soulTraits,
  type SoulTraitPart,
} from "../src/data/soulTraits";

type PortalSoulMetadata = Omit<SoulMetadata, "metadataUri"> & {
  mml?: string;
};

type SoulAttribute = {
  trait_type: string;
  value: string | number;
};

type SoulMetadataRecord = SoulMetadata & {
  tokenId: number;
};

type SoulTrait = {
  idx: number;
  displayName: string;
  part: SoulTraitPart;
};

type Soul = {
  idx: number;
  name: string;
  background: number;
  body: number;
  familiar: number;
  head: number;
  prop: number;
  rune: number;
  affinity: number;
  undesirable: number;
  transmutedFromNumber: number;
  transmutedFrom: string;
  burnOrder: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "../src/data");
const portalMetadataBaseUrl = "https://portal.forgottenrunes.com/api/souls/data";

const traitTypeByPart = {
  background: "Background",
  body: "Body",
  familiar: "Familiar",
  head: "Head",
  prop: "Prop",
  rune: "Rune",
  affinity: "Affinity",
  undesirable: "Undesirable",
} satisfies Record<SoulTraitPart, string>;

const metadataUriFor = (tokenId: number) =>
  `${portalMetadataBaseUrl}/${tokenId}`;

const toObjectLiteral = (value: unknown): string =>
  JSON.stringify(value, null, 2).replace(/"(\w+)":/g, "$1:");

const parseTokenId = (input: string | undefined): number => {
  const tokenId = Number(input);
  if (!Number.isInteger(tokenId) || tokenId < 0) {
    throw new Error("Usage: pnpm tsx scripts/update-soul-metadata.ts <token-id>");
  }
  return tokenId;
};

const fetchSoulMetadata = async (tokenId: number): Promise<SoulMetadata> => {
  const metadataUri = metadataUriFor(tokenId);
  const response = await fetch(metadataUri);

  if (response.status === 400 || response.status === 404) {
    throw new Error(`Soul #${tokenId} does not exist at ${metadataUri}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch soul metadata for #${tokenId}: ${response.status} ${response.statusText}`,
    );
  }

  const metadata = (await response.json()) as PortalSoulMetadata;

  return {
    name: metadata.name,
    image: metadata.image,
    attributes: metadata.attributes,
    background_color: metadata.background_color,
    metadataUri,
  };
};

const sortedMetadataRecords = (
  metadataMap: Record<string, SoulMetadata>,
): SoulMetadataRecord[] =>
  Object.entries(metadataMap)
    .map(([tokenId, metadata]) => ({
      ...metadata,
      tokenId: Number(tokenId),
    }))
    .sort((a, b) => a.tokenId - b.tokenId);

const attributeValue = (
  metadata: SoulMetadataRecord,
  traitType: string,
): string | number | undefined =>
  metadata.attributes.find((attribute) => attribute.trait_type === traitType)
    ?.value;

const numericAttributeValue = (
  metadata: SoulMetadataRecord,
  traitType: string,
): number => {
  const value = attributeValue(metadata, traitType);
  return typeof value === "number" ? value : Number(value);
};

const stringAttributeValue = (
  metadata: SoulMetadataRecord,
  traitType: string,
): string => {
  const value = attributeValue(metadata, traitType);
  return typeof value === "string" ? value : String(value ?? "");
};

const buildSoulData = (metadata: SoulMetadataRecord[]) => {
  const nextSoulTraits: SoulTrait[] = soulTraits.map((trait) => ({ ...trait }));
  const traitIndexByPartAndName = new Map<string, number>();

  for (const trait of nextSoulTraits) {
    traitIndexByPartAndName.set(`${trait.part}:${trait.displayName}`, trait.idx);
  }

  for (const soul of metadata) {
    for (const part of soulTraitParts) {
      const displayName = stringAttributeValue(soul, traitTypeByPart[part]);
      if (!displayName) continue;

      const key = `${part}:${displayName}`;
      if (!traitIndexByPartAndName.has(key)) {
        const idx = nextSoulTraits.length;
        nextSoulTraits.push({ idx, displayName, part });
        traitIndexByPartAndName.set(key, idx);
      }
    }
  }

  const souls: Soul[] = metadata.map((soul) => {
    const traitIndexFor = (part: SoulTraitPart): number => {
      const value = stringAttributeValue(soul, traitTypeByPart[part]);
      return traitIndexByPartAndName.get(`${part}:${value}`) ?? 7777;
    };

    return {
      idx: soul.tokenId,
      name: soul.name,
      background: traitIndexFor("background"),
      body: traitIndexFor("body"),
      familiar: traitIndexFor("familiar"),
      head: traitIndexFor("head"),
      prop: traitIndexFor("prop"),
      rune: traitIndexFor("rune"),
      affinity: traitIndexFor("affinity"),
      undesirable: traitIndexFor("undesirable"),
      transmutedFromNumber: numericAttributeValue(
        soul,
        "Transmuted from number",
      ),
      transmutedFrom: stringAttributeValue(soul, "Transmuted from"),
      burnOrder: numericAttributeValue(soul, "Burn order"),
    };
  });

  return {
    soulTraits: nextSoulTraits,
    souls,
    soulsMap: Object.fromEntries(souls.map((soul) => [soul.idx, soul])),
    metadataMap: Object.fromEntries(
      metadata.map(({ tokenId, ...soul }) => [tokenId, soul]),
    ),
  };
};

const writeDataFiles = (metadata: SoulMetadataRecord[]) => {
  const { soulTraits, souls, soulsMap, metadataMap } = buildSoulData(metadata);

  fs.writeFileSync(
    path.join(dataDir, "soulsMetadataMap.ts"),
    `export type SoulAttribute = {
  trait_type: string;
  value: string | number;
};

export type SoulMetadata = {
  name: string;
  image: string;
  attributes: SoulAttribute[];
  background_color?: string;
  metadataUri: string;
};

export const soulsMetadataMap: Record<string, SoulMetadata> = ${toObjectLiteral(
      metadataMap,
    )};
`,
  );

  fs.writeFileSync(
    path.join(dataDir, "soulTraits.ts"),
    `export const soulTraitParts = [
  "background",
  "body",
  "familiar",
  "head",
  "prop",
  "rune",
  "affinity",
  "undesirable",
] as const;

export type SoulTraitPart = (typeof soulTraitParts)[number];

export type Trait = {
  idx: number;
  displayName: string;
  part: SoulTraitPart;
};

export const soulTraits: Trait[] = ${toObjectLiteral(soulTraits)};
`,
  );

  fs.writeFileSync(
    path.join(dataDir, "soulsWithTraitsMap.ts"),
    `export type Soul = {
  idx: number;
  name: string;
  background: number;
  body: number;
  familiar: number;
  head: number;
  prop: number;
  rune: number;
  affinity: number;
  undesirable: number;
  transmutedFromNumber: number;
  transmutedFrom: string;
  burnOrder: number;
};

export const soulsWithTraitsMap: Record<string, Soul> = ${toObjectLiteral(
      soulsMap,
    )};
`,
  );

  fs.writeFileSync(
    path.join(dataDir, "soulsWithTraits.ts"),
    `export type Soul = {
  idx: number;
  name: string;
  background: number;
  body: number;
  familiar: number;
  head: number;
  prop: number;
  rune: number;
  affinity: number;
  undesirable: number;
  transmutedFromNumber: number;
  transmutedFrom: string;
  burnOrder: number;
};

export const soulsWithTraits: Soul[] = ${toObjectLiteral(souls)};
`,
  );
};

const main = async () => {
  const tokenId = parseTokenId(process.argv[2]);
  const tokenKey = String(tokenId);
  const existingCount = Object.keys(soulsMetadataMap).length;
  const nextMetadata = {
    ...soulsMetadataMap,
    [tokenKey]: await fetchSoulMetadata(tokenId),
  };
  const metadata = sortedMetadataRecords(nextMetadata);

  writeDataFiles(metadata);

  const nextCount = Object.keys(nextMetadata).length;
  const action = tokenKey in soulsMetadataMap ? "Refreshed" : "Added";
  console.log(`${action} Forgotten Soul #${tokenId}.`);
  console.log(`Soul metadata entries: ${existingCount} -> ${nextCount}`);
  console.log(`Output directory: ${dataDir}`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
