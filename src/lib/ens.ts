import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.llamarpc.com"),
});

/**
 * Checks if a string is a valid Ethereum address
 */
export function isAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if a string looks like an ENS name
 * Supports subdomains like subdomain.example.eth
 */
export function isENSName(name: string): boolean {
  // ENS names must end with .eth
  // Can have multiple segments (subdomains) separated by dots
  // Each segment can contain lowercase letters, numbers, and hyphens
  // Segments cannot start or end with hyphens
  // Case-insensitive matching
  return /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+eth$/i.test(name);
}

/**
 * Resolves an ENS name to an Ethereum address
 * Returns the address if successful, null if not found, or throws on error
 */
export async function resolveENS(name: string): Promise<string | null> {
  try {
    const address = await publicClient.getEnsAddress({
      name: name.toLowerCase(),
    });
    return address || null;
  } catch (error) {
    console.error(`Error resolving ENS name ${name}:`, error);
    return null;
  }
}

/**
 * Resolves a string that could be either an address or ENS name
 * Returns the resolved address, or null if invalid/unresolvable
 */
export async function resolveAddressOrENS(
  input: string,
): Promise<string | null> {
  const trimmed = input.trim();

  // If it's already a valid address, return it normalized
  if (isAddress(trimmed)) {
    return trimmed.toLowerCase();
  }

  // If it looks like an ENS name, try to resolve it
  if (isENSName(trimmed)) {
    return await resolveENS(trimmed);
  }

  // Not a valid address or ENS name
  return null;
}

/**
 * Resolves multiple addresses/ENS names in parallel
 * Returns a map of input -> resolved address (or null if failed)
 */
export async function resolveAddressesOrENS(
  inputs: string[],
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();
  const promises = inputs.map(async (input) => {
    const resolved = await resolveAddressOrENS(input);
    results.set(input, resolved);
  });
  await Promise.all(promises);
  return results;
}
