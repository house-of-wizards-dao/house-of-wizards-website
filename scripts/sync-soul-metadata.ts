/**
 * Sync Forgotten Souls metadata into local typed data files.
 *
 * Run with: pnpm tsx scripts/sync-soul-metadata.ts
 *
 * Optional environment:
 * - OPENSEA_API_KEY: use OpenSea to collect token IDs before fetching portal metadata
 * - SOULS_MAX_TOKEN_ID: max token ID to probe when OpenSea is unavailable (default: 9999)
 * - SOULS_SYNC_CONCURRENCY: concurrent metadata requests (default: 25)
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

type SoulAttribute = {
  trait_type: string;
  value: string | number;
};

type SoulMetadata = {
  name: string;
  image: string;
  attributes: SoulAttribute[];
  background_color?: string;
};

type PortalSoulMetadata = SoulMetadata & {
  mml?: string;
};

type SoulMetadataRecord = SoulMetadata & {
  tokenId: number;
  metadataUri: string;
};

const soulTraitParts = [
  "background",
  "body",
  "familiar",
  "head",
  "prop",
  "rune",
  "affinity",
  "undesirable",
] as const;

type SoulTraitPart = (typeof soulTraitParts)[number];

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

const soulsMaxTokenId = Number(process.env.SOULS_MAX_TOKEN_ID ?? "9999");
const concurrency = Number(process.env.SOULS_SYNC_CONCURRENCY ?? "25");
const portalMetadataBaseUrl = "https://portal.forgottenrunes.com/api/souls/data";
const openSeaCollectionUrl =
  "https://api.opensea.io/api/v2/collection/forgottensouls/nfts?limit=200";

const assertPositiveInteger = (name: string, value: number) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer. Received: ${value}`);
  }
};

const metadataUriFor = (tokenId: number) =>
  `${portalMetadataBaseUrl}/${tokenId}`;

const toObjectLiteral = (value: unknown): string =>
  JSON.stringify(value, null, 2).replace(/"(\w+)":/g, "$1:");

const fetchSoulMetadata = async (
  tokenId: number,
): Promise<SoulMetadataRecord | null> => {
  const metadataUri = metadataUriFor(tokenId);
  const response = await fetch(metadataUri);

  if (response.status === 400 || response.status === 404) {
    return null;
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
    tokenId,
    metadataUri,
  };
};

const mapWithConcurrency = async <TInput, TOutput>(
  items: TInput[],
  limit: number,
  mapper: (item: TInput) => Promise<TOutput>,
): Promise<TOutput[]> => {
  const results = new Array<TOutput>(items.length);
  let nextIndex = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        results[currentIndex] = await mapper(items[currentIndex]);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

const fetchSoulTokenIdsFromOpenSea = async (): Promise<number[]> => {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) return [];

  const tokenIds = new Set<number>();
  let next: string | undefined;

  do {
    const url = next
      ? `${openSeaCollectionUrl}&next=${encodeURIComponent(next)}`
      : openSeaCollectionUrl;
    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `OpenSea token ID fetch failed: ${response.status} ${response.statusText}`,
      );
    }

    const payload = (await response.json()) as {
      nfts?: Array<{ identifier?: string }>;
      next?: string;
    };

    for (const nft of payload.nfts ?? []) {
      const tokenId = Number(nft.identifier);
      if (Number.isInteger(tokenId)) tokenIds.add(tokenId);
    }

    next = payload.next;
  } while (next);

  return Array.from(tokenIds).sort((a, b) => a - b);
};

const collectMetadataByTokenIds = async (
  tokenIds: number[],
): Promise<SoulMetadataRecord[]> => {
  const metadata = await mapWithConcurrency(tokenIds, concurrency, async (id) =>
    fetchSoulMetadata(id),
  );

  return metadata
    .filter((entry): entry is SoulMetadataRecord => entry !== null)
    .sort((a, b) => a.tokenId - b.tokenId);
};

const collectMetadataByPortalProbe = async (): Promise<SoulMetadataRecord[]> => {
  const tokenIds = Array.from({ length: soulsMaxTokenId + 1 }, (_, idx) => idx);
  return collectMetadataByTokenIds(tokenIds);
};

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

const buildSoulData = (metadata: SoulMetadataRecord[]) => {
  const displayNamesByPart = Object.fromEntries(
    soulTraitParts.map((part) => [part, new Set<string>()]),
  ) as Record<SoulTraitPart, Set<string>>;

  for (const soul of metadata) {
    for (const part of soulTraitParts) {
      const value = stringAttributeValue(soul, traitTypeByPart[part]);
      if (value) displayNamesByPart[part].add(value);
    }
  }

  const soulTraits: SoulTrait[] = [];
  const traitIndexByPartAndName = new Map<string, number>();

  for (const part of soulTraitParts) {
    const displayNames = Array.from(displayNamesByPart[part]).sort((a, b) =>
      a.localeCompare(b),
    );

    for (const displayName of displayNames) {
      const idx = soulTraits.length;
      soulTraits.push({ idx, displayName, part });
      traitIndexByPartAndName.set(`${part}:${displayName}`, idx);
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
    soulTraits,
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
  assertPositiveInteger("SOULS_MAX_TOKEN_ID", soulsMaxTokenId);
  assertPositiveInteger("SOULS_SYNC_CONCURRENCY", concurrency);

  let metadata: SoulMetadataRecord[] = [];

  try {
    const openSeaTokenIds = await fetchSoulTokenIdsFromOpenSea();
    if (openSeaTokenIds.length > 0) {
      console.log(`Collected ${openSeaTokenIds.length} soul IDs from OpenSea.`);
      metadata = await collectMetadataByTokenIds(openSeaTokenIds);
    }
  } catch (error) {
    console.warn(
      error instanceof Error
        ? `OpenSea sync failed, falling back to portal probe: ${error.message}`
        : "OpenSea sync failed, falling back to portal probe.",
    );
  }

  if (metadata.length === 0) {
    console.log(
      `Probing portal metadata IDs 0 through ${soulsMaxTokenId} for existing souls.`,
    );
    metadata = await collectMetadataByPortalProbe();
  }

  writeDataFiles(metadata);

  console.log(`Synced ${metadata.length} Forgotten Souls.`);
  console.log(`Output directory: ${dataDir}`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
