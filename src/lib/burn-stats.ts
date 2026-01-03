import { getWizards, type WizardData } from "./wizards";
import { fetchAllWizardsAndSouls, type SoulGraphQLResponse, type WizardGraphQLResponse } from "./souls-graphql";
import { TRAITS } from "./traits";
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

    // Fetch both wizards and souls from GraphQL endpoint in a single query
    // The query uses GraphQL relationships to include wizard data with each soul
    console.log(`Fetching wizards and souls from GraphQL endpoint`);
    const { Soul: allSouls } = await fetchAllWizardsAndSouls();
    console.log(`Total fetched ${allSouls.length} souls (with nested wizard data) from GraphQL`);

    // Process souls data from GraphQL
    // Each soul has its wizard data nested in transmutedFromToken.wizard
    for (const soul of allSouls) {
      const wizard = soul.transmutedFromToken?.wizard;
      if (!wizard) {
        console.warn(
          `Warning: Soul ${soul.name} has no associated wizard data`
        );
        continue;
      }

      // Use wizard's tokenId from nested token object
      // Convert to string to ensure consistent format for comparison
      const tokenId = String(wizard.token?.tokenId || "");
      if (!tokenId || tokenId === "undefined" || tokenId === "null") {
        console.warn(
          `Warning: Wizard for soul ${soul.name} has no tokenId in token object`
        );
        continue;
      }

      // Build soul data directly from GraphQL response
      const soulData: WizardData = {
        name: soul.name,
        head: soul.head,
        body: soul.body,
        prop: soul.prop,
        familiar: soul.familiar,
        rune: soul.rune,
        background: soul.background,
      };

      // Build wizard data from nested GraphQL response
      const wizardData: WizardData = {
        name: wizard.name,
        head: wizard.head,
        body: wizard.body,
        prop: wizard.prop,
        familiar: wizard.familiar,
        rune: wizard.rune,
        background: wizard.background,
      };

      // Extract burnIndex (burn order) directly from GraphQL
      if (soul.burnIndex !== undefined && soul.burnIndex !== null) {
        newOrder[tokenId] = soul.burnIndex;
      }

      normalizedSouls[tokenId] = soulData;
      normalizedWizards[tokenId] = wizardData;
      burnedWizards.push(tokenId);

      // Extract traits from GraphQL wizard data
      for (const trait of TRAITS) {
        const value = wizardData[trait as keyof typeof wizardData];
        if (value && value.trim()) {
          const dictKey = `${trait}_${String(value)}`;
          if (!traitDict[dictKey]) {
            traitDict[dictKey] = [];
          }
          traitDict[dictKey].push(tokenId);
          // Note: newTraitCounts will be calculated below for all wizards
        }
      }
    }

    console.log(
      `Processed ${Object.keys(newOrder).length} souls with burn orders`
    );

    const tokenIds = Object.keys(newOrder);
    const burned = tokenIds.length;

    console.log(`Found ${burnedWizards.length} burned wizards from GraphQL`);

    // Get original trait counts from all wizards (local data)
    const localWizzies = getWizards();

    // First, count all traits from all wizards (original counts)
    for (const [tokenId, wizard] of Object.entries(localWizzies)) {
      for (const trait of TRAITS) {
        const value = wizard[trait as keyof typeof wizard];
        if (value && value.trim()) {
          originalTraitCounts[trait][value] =
            (originalTraitCounts[trait][value] || 0) + 1;
        }
      }
    }

    // Count traits from burned wizards (from GraphQL data)
    // We need to count every time a trait appears in burned wizards
    const burnedTraitCounts: { [trait: string]: { [value: string]: number } } = {};
    TRAITS.forEach((trait) => {
      burnedTraitCounts[trait] = {};
    });

    for (const tokenId of burnedWizards) {
      const wizardData = normalizedWizards[tokenId];
      if (!wizardData) {
        console.warn(`Warning: No wizard data found for burned tokenId: ${tokenId}`);
        continue;
      }
      
      for (const trait of TRAITS) {
        const value = wizardData[trait as keyof typeof wizardData];
        if (value && String(value).trim()) {
          const valueStr = String(value).trim();
          burnedTraitCounts[trait][valueStr] =
            (burnedTraitCounts[trait][valueStr] || 0) + 1;
        }
      }
    }

    console.log(`Counted traits from ${burnedWizards.length} burned wizards`);

    // Calculate new counts: original - burned
    for (const trait of TRAITS) {
      for (const value in originalTraitCounts[trait]) {
        const originalCount = originalTraitCounts[trait][value];
        const burnedCount = burnedTraitCounts[trait][value] || 0;
        newTraitCounts[trait][value] = originalCount - burnedCount;
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
