import { getWizards, type WizardData } from "./wizards";
import { fetchAllSoulsWithTransmutedWizard } from "./frwc-graphql";
import { TRAITS } from "./traits";

// In-memory cache for stats
let cachedStats: StatsData | null = null;
let lastUpdateTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface TraitBurnStat {
  traitType: string;
  value: string;
  original: number;
  remaining: number;
  burned: number;
  tokenIds: string[];
}

export interface Burn {
  tokenId: string;
  burnIndex: number; // The burnIndex from GraphQL
  wizard: WizardData;
  soul: WizardData;
}

export interface TraitOption {
  type: typeof TRAITS[number];
  name: string;
}

export interface StatsData {
  traits: TraitBurnStat[];
  burns: Burn[]; // Sorted by burnIndex descending (highest first)
  filterOptions: {
    wizard: TraitOption[];
    soul: TraitOption[];
  };
}

// Legacy export for backwards compatibility during migration
export type TraitStat = TraitBurnStat;


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
    // Initialize trait counts
    const originalTraitCounts: {
      [trait: string]: { [value: string]: number };
    } = {};
    const burnedTraitCounts: {
      [trait: string]: { [value: string]: number };
    } = {};
    const traitDict: { [key: string]: string[] } = {};

    TRAITS.forEach((trait) => {
      originalTraitCounts[trait] = {};
      burnedTraitCounts[trait] = {};
    });

    // Fetch both wizards and souls from GraphQL endpoint in a single query
    console.log(`Fetching wizards and souls from GraphQL endpoint`);
    const { Soul: allSouls } = await fetchAllSoulsWithTransmutedWizard();
    console.log(`Total fetched ${allSouls.length} souls (with nested wizard data) from GraphQL`);

    // Build burns array directly from GraphQL response in a single pass
    // Also collect unique trait options for filters
    const burns: Burn[] = [];
    const burnedWizardTokenIds = new Set<string>();
    const wizardTraitOptionsMap = new Map<string, TraitOption>();
    const soulTraitOptionsMap = new Map<string, TraitOption>();

    for (const soul of allSouls) {
      const wizard = soul.transmutedFromToken?.wizard;
      if (!wizard) {
        console.warn(`Warning: Soul ${soul.name} has no associated wizard data`);
        continue;
      }

      // Extract tokenId from wizard
      const tokenId = String(wizard.token?.tokenId || "");
      if (!tokenId || tokenId === "undefined" || tokenId === "null") {
        console.warn(`Warning: Wizard for soul ${soul.name} has no tokenId in token object`);
        continue;
      }

      // Validate burnIndex
      if (soul.burnIndex === undefined || soul.burnIndex === null) {
        console.warn(`Warning: Soul ${soul.name} has no burnIndex`);
        continue;
      }

      // Build wizard and soul data directly from GraphQL response
      const wizardData: WizardData = {
        name: wizard.name,
        head: wizard.head,
        body: wizard.body,
        prop: wizard.prop,
        familiar: wizard.familiar,
        rune: wizard.rune,
        background: wizard.background,
      };

      const soulData: WizardData = {
        name: soul.name,
        head: soul.head,
        body: soul.body,
        prop: soul.prop,
        familiar: soul.familiar,
        rune: soul.rune,
        background: soul.background,
      };

      // Create burn object directly
      burns.push({
        tokenId,
        burnIndex: soul.burnIndex,
        wizard: wizardData,
        soul: soulData,
      });

      burnedWizardTokenIds.add(tokenId);

      // Count traits from burned wizard for trait stats
      // Also collect unique trait options for filters
      for (const trait of TRAITS) {
        const value = wizardData[trait as keyof typeof wizardData];
        if (value && String(value).trim()) {
          const valueStr = String(value).trim();
          const dictKey = `${trait}_${valueStr}`;
          
          // Count for burned traits
          burnedTraitCounts[trait][valueStr] =
            (burnedTraitCounts[trait][valueStr] || 0) + 1;
          
          // Build traitDict for TraitBurnStat.tokenIds array
          if (!traitDict[dictKey]) {
            traitDict[dictKey] = [];
          }
          traitDict[dictKey].push(tokenId);
          
          // Collect wizard trait options for filter
          if (!wizardTraitOptionsMap.has(dictKey)) {
            wizardTraitOptionsMap.set(dictKey, { type: trait, name: valueStr });
          }
        }
        
        // Collect soul trait options for filter
        const soulValue = soulData[trait as keyof typeof soulData];
        if (soulValue && String(soulValue).trim()) {
          const soulValueStr = String(soulValue).trim();
          const soulDictKey = `${trait}_${soulValueStr}`;
          if (!soulTraitOptionsMap.has(soulDictKey)) {
            soulTraitOptionsMap.set(soulDictKey, { type: trait, name: soulValueStr });
          }
        }
      }
    }

    // Sort burns by burnIndex descending (highest first)
    burns.sort((a, b) => b.burnIndex - a.burnIndex);

    const burned = burns.length;
    console.log(`Processed ${burned} burns from GraphQL`);

    // Get original trait counts from all wizards (local data)
    const localWizzies = getWizards();
    for (const [tokenId, wizard] of Object.entries(localWizzies)) {
      for (const trait of TRAITS) {
        const value = wizard[trait as keyof typeof wizard];
        if (value && value.trim()) {
          originalTraitCounts[trait][value] =
            (originalTraitCounts[trait][value] || 0) + 1;
        }
      }
    }

    // Calculate new counts: original - burned
    const newTraitCounts: { [trait: string]: { [value: string]: number } } = {};
    TRAITS.forEach((trait) => {
      newTraitCounts[trait] = {};
    });

    for (const trait of TRAITS) {
      for (const value in originalTraitCounts[trait]) {
        const originalCount = originalTraitCounts[trait][value];
        const burnedCount = burnedTraitCounts[trait][value] || 0;
        newTraitCounts[trait][value] = originalCount - burnedCount;
      }
    }

    // Build trait burn stats output
    const output: TraitBurnStat[] = [];
    for (const trait of TRAITS) {
      for (const value in originalTraitCounts[trait]) {
        const originalCount = originalTraitCounts[trait][value];
        const remainingCount = newTraitCounts[trait][value] || 0;
        const burnedCount = originalCount - remainingCount;
        const dictKey = `${trait}_${value}`;

        output.push({
          traitType: trait,
          value: value,
          original: originalCount,
          remaining: remainingCount,
          burned: burnedCount,
          tokenIds: traitDict[dictKey] || [],
        });
      }
    }

    const resultJson = output.sort((a, b) => a.value.localeCompare(b.value));

    // Build filter options from collected unique traits
    const wizardTraitOptions = Array.from(wizardTraitOptionsMap.values()).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.name.localeCompare(b.name);
    });
    
    const soulTraitOptions = Array.from(soulTraitOptionsMap.values()).sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.name.localeCompare(b.name);
    });

    const stats: StatsData = {
      traits: resultJson,
      burns,
      filterOptions: {
        wizard: wizardTraitOptions,
        soul: soulTraitOptions,
      },
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
