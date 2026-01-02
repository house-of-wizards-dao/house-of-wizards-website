// @ts-ignore - JSON import
import wizziesData from '../data/wizzies.json';

export interface WizardData {
  name: string;
  head?: string;
  body?: string;
  prop?: string;
  familiar?: string;
  rune?: string;
  background?: string;
}

export interface WizardsData {
  [tokenId: string]: WizardData;
}

/**
 * Get all wizard data as a typed object
 */
export function getWizards(): WizardsData {
  return wizziesData as WizardsData;
}

/**
 * Get a specific wizard by token ID
 */
export function getWizard(tokenId: string): WizardData | undefined {
  const wizzies = getWizards();
  return wizzies[tokenId];
}

/**
 * Get wizard name by token ID
 */
export function getWizardName(tokenId: string): string {
  const wizard = getWizard(tokenId);
  return wizard?.name || '';
}

/**
 * Get a specific trait value for a wizard
 */
export function getWizardTrait(tokenId: string, trait: 'head' | 'body' | 'prop' | 'familiar' | 'rune' | 'background'): string | undefined {
  const wizard = getWizard(tokenId);
  return wizard?.[trait];
}

/**
 * Get all wizards that have a specific trait value
 */
export function getWizardsByTrait(trait: 'head' | 'body' | 'prop' | 'familiar' | 'rune' | 'background', value: string): string[] {
  const wizzies = getWizards();
  return Object.keys(wizzies).filter(tokenId => {
    const wizard = wizzies[tokenId];
    return wizard[trait] === value;
  });
}

/**
 * Get all unique trait values for a given trait type
 */
export function getTraitValues(trait: 'head' | 'body' | 'prop' | 'familiar' | 'rune' | 'background'): string[] {
  const wizzies = getWizards();
  const values = new Set<string>();
  
  Object.values(wizzies).forEach(wizard => {
    const value = wizard[trait];
    if (value && value.trim()) {
      values.add(value);
    }
  });
  
  return Array.from(values).sort();
}

/**
 * Get total number of wizards
 */
export function getWizardCount(): number {
  return Object.keys(getWizards()).length;
}

