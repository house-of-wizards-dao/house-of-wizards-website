// Contract Configuration for Auction System
import { Address } from "viem";

export interface ContractConfig {
  address: Address;
  chainId: number;
  explorerUrl: string;
  deployedBlock?: number;
}

// Contract configurations for different networks
export const CONTRACT_CONFIGS: Record<string, ContractConfig> = {
  // Sepolia Testnet (for development)
  sepolia: {
    address: "0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71" as Address, // Latest deployed contract
    chainId: 11155111,
    explorerUrl: "https://sepolia.etherscan.io",
    deployedBlock: 0, // TODO: Add deployed block number for event filtering
  },
  // Ethereum Mainnet (for production)
  mainnet: {
    address: "0x0000000000000000000000000000000000000000" as Address, // TODO: Replace with deployed contract
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    deployedBlock: 0,
  },
  // Polygon (alternative)
  polygon: {
    address: "0x0000000000000000000000000000000000000000" as Address, // TODO: Replace with deployed contract
    chainId: 137,
    explorerUrl: "https://polygonscan.com",
    deployedBlock: 0,
  },
};

// Get current contract config based on environment
export function getContractConfig(): ContractConfig {
  const network = process.env.NEXT_PUBLIC_CONTRACT_NETWORK || "sepolia";
  const config = CONTRACT_CONFIGS[network];

  if (!config) {
    throw new Error(`Contract configuration not found for network: ${network}`);
  }

  return config;
}

// Helper function to get contract address
export function getContractAddress(): Address {
  return getContractConfig().address;
}

// Helper function to get explorer URL for transaction
export function getTransactionUrl(txHash: string): string {
  const config = getContractConfig();
  return `${config.explorerUrl}/tx/${txHash}`;
}

// Helper function to get explorer URL for address
export function getAddressUrl(address: string): string {
  const config = getContractConfig();
  return `${config.explorerUrl}/address/${address}`;
}

// Deployment checklist and instructions
export const DEPLOYMENT_CHECKLIST = `
🚀 **Auction Contract Deployment Checklist**

1. **Deploy Contract**
   - Compile the Solidity contract with Hardhat/Foundry
   - Deploy to your chosen network (Sepolia for testing)
   - Note down the contract address and deployment block

2. **Update Configuration**
   - Replace CONTRACT_CONFIGS addresses with your deployed contract
   - Set NEXT_PUBLIC_CONTRACT_NETWORK in .env.local
   - Update deployedBlock for efficient event filtering

3. **Environment Variables**
   Add to your .env.local file:
   \`\`\`
   NEXT_PUBLIC_CONTRACT_NETWORK=sepolia
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
   \`\`\`

4. **Test Contract Integration**
   - Connect wallet to same network as contract
   - Test auction creation (owner only)
   - Test bidding functionality
   - Verify events are being emitted

5. **Production Deployment**
   - Deploy contract to mainnet
   - Update configuration for mainnet
   - Test with small amounts first
   - Set up monitoring for events and errors

**Smart Contract Functions Available:**
- createNewAuction(name, initialPrice, duration) - Owner only
- sendNewBid(auctionIndex) - Payable, anyone can bid
- getAuctionDetails(id) - View auction state
- closeAuction(id) - Owner only
- withdraw(auctionIndex) - Owner only, withdraw winning bid
- getTotalAuctions() - Get number of auctions
- getBidCount(id) - Get number of bids for auction
`;

// Contract owner utilities
export const OWNER_FUNCTIONS = {
  createAuction: "createNewAuction",
  closeAuction: "closeAuction",
  withdraw: "withdraw",
} as const;

// Public functions that anyone can call
export const PUBLIC_FUNCTIONS = {
  bid: "sendNewBid",
  getDetails: "getAuctionDetails",
  getTotalAuctions: "getTotalAuctions",
  getBidCount: "getBidCount",
  getAuction: "auctions", // struct getter
} as const;

// Contract events for monitoring
export const CONTRACT_EVENTS = {
  auctionCreated: "CreateAuction",
  bidPlaced: "UpdatedBid",
  auctionStateChanged: "UpdatedAuctionState",
  withdrawal: "AuctionWithdraw",
} as const;
