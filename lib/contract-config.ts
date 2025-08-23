/**
 * Contract configuration with environment variable support
 * This file centralizes all contract addresses and provides validation
 */

// Contract address type for type safety
export interface ContractAddresses {
  [chainId: number]: string;
}

// Environment variable names for contract addresses
const CONTRACT_ENV_VARS = {
  SEPOLIA: 'NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA',
  MAINNET: 'NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET', 
  POLYGON: 'NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON',
  OPTIMISM: 'NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM',
  ARBITRUM: 'NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM',
} as const;

// Default fallback addresses (for development/testing)
const DEFAULT_CONTRACT_ADDRESSES: ContractAddresses = {
  11155111: "0x172084988957cAC63766fa0495f3FfFb89256064", // Sepolia testnet (fallback)
} as const;

/**
 * Validates an Ethereum address format
 */
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Gets contract addresses from environment variables with validation
 */
function getContractAddressesFromEnv(): ContractAddresses {
  const addresses: ContractAddresses = {};

  // Sepolia (testnet)
  const sepoliaAddress = process.env[CONTRACT_ENV_VARS.SEPOLIA];
  if (sepoliaAddress) {
    if (!isValidAddress(sepoliaAddress)) {
      throw new Error(`Invalid Sepolia contract address format: ${sepoliaAddress}`);
    }
    addresses[11155111] = sepoliaAddress;
  }

  // Mainnet
  const mainnetAddress = process.env[CONTRACT_ENV_VARS.MAINNET];
  if (mainnetAddress) {
    if (!isValidAddress(mainnetAddress)) {
      throw new Error(`Invalid Mainnet contract address format: ${mainnetAddress}`);
    }
    addresses[1] = mainnetAddress;
  }

  // Polygon
  const polygonAddress = process.env[CONTRACT_ENV_VARS.POLYGON];
  if (polygonAddress) {
    if (!isValidAddress(polygonAddress)) {
      throw new Error(`Invalid Polygon contract address format: ${polygonAddress}`);
    }
    addresses[137] = polygonAddress;
  }

  // Optimism
  const optimismAddress = process.env[CONTRACT_ENV_VARS.OPTIMISM];
  if (optimismAddress) {
    if (!isValidAddress(optimismAddress)) {
      throw new Error(`Invalid Optimism contract address format: ${optimismAddress}`);
    }
    addresses[10] = optimismAddress;
  }

  // Arbitrum
  const arbitrumAddress = process.env[CONTRACT_ENV_VARS.ARBITRUM];
  if (arbitrumAddress) {
    if (!isValidAddress(arbitrumAddress)) {
      throw new Error(`Invalid Arbitrum contract address format: ${arbitrumAddress}`);
    }
    addresses[42161] = arbitrumAddress;
  }

  return addresses;
}

/**
 * Gets contract addresses with environment variable override and fallbacks
 */
export function getContractAddresses(): ContractAddresses {
  try {
    const envAddresses = getContractAddressesFromEnv();
    
    // Merge with defaults, environment variables take precedence
    return {
      ...DEFAULT_CONTRACT_ADDRESSES,
      ...envAddresses,
    };
  } catch (error) {
    // In development mode, log warning and use defaults
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '⚠️  Contract address validation failed, using defaults:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return DEFAULT_CONTRACT_ADDRESSES;
    }
    
    // In production, fail fast
    throw error;
  }
}

/**
 * Gets contract address for specific chain with validation
 */
export function getContractAddress(chainId: number): string | undefined {
  const addresses = getContractAddresses();
  return addresses[chainId];
}

/**
 * Validates that a contract address is configured for the given chain
 */
export function validateContractAddress(chainId: number): string {
  const address = getContractAddress(chainId);
  
  if (!address) {
    throw new Error(
      `No contract address configured for chain ID ${chainId}. ` +
      `Please set the appropriate environment variable.`
    );
  }
  
  if (!isValidAddress(address)) {
    throw new Error(`Invalid contract address format for chain ${chainId}: ${address}`);
  }
  
  return address;
}

/**
 * Gets all supported chain IDs that have contract addresses
 */
export function getSupportedChainIds(): number[] {
  const addresses = getContractAddresses();
  return Object.keys(addresses).map(Number);
}

/**
 * Checks if a chain is supported (has a contract address)
 */
export function isChainSupported(chainId: number): boolean {
  const addresses = getContractAddresses();
  return chainId in addresses;
}

// Export environment variable names for documentation
export { CONTRACT_ENV_VARS };