import { getWizards, type WizardData } from "./wizards";
import {
  fetchNFTsForCollection,
  extractTokenId,
  extractAttributes,
} from "./alchemy";
import { TRAITS } from "./traits";
const SOULS_CONTRACT = "0x251b5f14a825c537ff788604ea1b58e49b70726f";
const FLAMES = 1112;

// In-memory cache for stats
let cachedStats: StatsData | null = null;
let lastUpdateTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface TraitStat {
  type: string;
  name: string;
  old: number;
  new: number;
  diff: number;
  wizards: string[];
}

export interface Burn {
  tokenId: string;
  burnOrder: number;
  wizard: WizardData;
  soul: WizardData;
}

export interface StatsData {
  traits: TraitStat[];
  burned: number;
  flames: number;
  burns: Burn[]; // Sorted by burnOrder descending (highest first)
}


export function isCacheValid(): boolean {
  if (!cachedStats) return false;
  const now = Date.now();
  return now - lastUpdateTime < CACHE_DURATION;
}

export async function getStats(
  forceRefresh: boolean = false
): Promise<StatsData> {
  // Return cached data if still valid and not forcing refresh
  if (!forceRefresh && isCacheValid()) {
    return cachedStats!;
  }

  try {
    const burnedWizards: string[] = [];
    const traitDict: { [key: string]: string[] } = {};
    const originalTraitCounts: {
      [trait: string]: { [value: string]: number };
    } = {};
    const newTraitCounts: { [trait: string]: { [value: string]: number } } = {};
    const newOrder: { [tokenId: string]: number } = {};
    const normalizedSouls: Record<string, WizardData> = {};
    const normalizedWizards: Record<string, WizardData> = {};

    // Initialize trait counts
    TRAITS.forEach((trait) => {
      originalTraitCounts[trait] = {};
      newTraitCounts[trait] = {};
    });

    // Fetch all souls from the collection
    console.log(`Fetching souls from contract: ${SOULS_CONTRACT}`);
    const allSouls = await fetchNFTsForCollection(SOULS_CONTRACT);
    console.log(`Total fetched ${allSouls.length} souls from collection`);

    // Process souls data
    for (const soul of allSouls) {
      const tokenId = extractTokenId(soul);
      if (!tokenId) {
        console.warn(
          `Warning: No tokenId found in soul. Keys: ${Object.keys(soul)}`
        );
        continue;
      }

      const soulName = (soul as any).title || (soul as any).name || "";
      const soulData: WizardData = {
        name: soulName,
      };

      const attributes = extractAttributes(soul);

      for (const attr of attributes) {
        const key = attr.trait_type || attr.key || attr.traitType || "";
        const value = attr.value;

        if (!key) continue;

        // Check for "Burn order" with various case/spacing variations
        const keyLower = key.toLowerCase().trim();
        if (
          keyLower === "burn order" ||
          keyLower === "burnorder" ||
          key === "Burn order"
        ) {
          try {
            newOrder[tokenId] =
              typeof value === "number" ? value : parseInt(String(value), 10);
          } catch (error) {
            console.warn(
              `Warning: Could not convert burn order value '${value}' to int for token ${tokenId}`
            );
          }
        } else {
          // Normalize trait key to lowercase and map to WizardData structure
          if (TRAITS.includes(keyLower as any)) {
            const traitKey = keyLower as typeof TRAITS[number];
            soulData[traitKey] = String(value);
          }
        }
      }

      normalizedSouls[tokenId] = soulData;
    }

    console.log(
      `Processed ${Object.keys(newOrder).length} souls with burn orders`
    );

    const tokenIds = Object.keys(newOrder);
    const burned = tokenIds.length;

    // Use local wizard data instead of fetching from Alchemy
    // We already have the burned token IDs from souls data
    const wizzies = getWizards();

    // Build burnedWizards array, traitDict, and normalized wizards from local data
    for (const tokenId of tokenIds) {
      const wizard = wizzies[tokenId];
      if (!wizard) {
        console.warn(`Warning: Wizard ${tokenId} not found in local data`);
        continue;
      }

      burnedWizards.push(tokenId);
      normalizedWizards[tokenId] = wizard;

      // Extract traits from local wizard data
      for (const trait of TRAITS) {
        const value = wizard[trait as keyof typeof wizard];
        if (value && value.trim()) {
          const dictKey = `${trait}_${String(value)}`;
          if (!traitDict[dictKey]) {
            traitDict[dictKey] = [];
          }
          traitDict[dictKey].push(tokenId);
        }
      }
    }

    console.log(`Found ${burnedWizards.length} burned wizards from local data`);

    // Get original trait counts from wizard data

    for (const [tokenId, wizard] of Object.entries(wizzies)) {
      for (const trait of TRAITS) {
        const value = wizard[trait as keyof typeof wizard];
        if (value && value.trim()) {
          originalTraitCounts[trait][value] =
            (originalTraitCounts[trait][value] || 0) + 1;

          if (!burnedWizards.includes(tokenId)) {
            newTraitCounts[trait][value] =
              (newTraitCounts[trait][value] || 0) + 1;
          }
        }
      }
    }

    // Build output
    const output: TraitStat[] = [];

    for (const trait of TRAITS) {
      for (const value in originalTraitCounts[trait]) {
        const oldCount = originalTraitCounts[trait][value];
        const newCount = newTraitCounts[trait][value] || 0;
        const dictKey = `${trait}_${value}`;

        output.push({
          type: trait,
          name: value,
          old: oldCount,
          new: newCount,
          diff: oldCount - newCount,
          wizards: traitDict[dictKey] || [],
        });
      }
    }

    const resultJson = output.sort((a, b) => a.name.localeCompare(b.name));

    // Build burns array - each burn contains wizard and soul data
    const burns: Burn[] = Object.entries(newOrder)
      .map(([tokenId, burnOrder]) => {
        const wizard = normalizedWizards[tokenId];
        const soul = normalizedSouls[tokenId];
        
        if (!wizard || !soul) {
          console.warn(`Warning: Missing wizard or soul data for token ${tokenId}`);
          return null;
        }
        
        return {
          tokenId,
          burnOrder,
          wizard,
          soul,
        };
      })
      .filter((burn): burn is Burn => burn !== null)
      .sort((a, b) => b.burnOrder - a.burnOrder); // Highest burn order first

    const stats: StatsData = {
      traits: resultJson,
      burned,
      flames: FLAMES - burned,
      burns,
    };

    // Cache the results
    cachedStats = stats;
    lastUpdateTime = Date.now();

    console.log("success");
    return stats;
  } catch (error) {
    console.error("Error in getStats:", error);
    throw error;
  }
}
