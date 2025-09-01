# 🚀 Contract Deployment Guide

## Quick Setup for Hardhat Deployment

Since you already have a deployed contract at `0x172084988957cAC63766fa0495f3FfFb89256064`, this guide shows you how to deploy your own fresh contract if needed.

## 📋 Prerequisites

✅ **Already Done:**
- [x] Hardhat installed (`@nomiclabs/hardhat-ethers` in package.json)
- [x] Contract code in `/contracts/AuctionSystem.sol`
- [x] Deploy script in `/scripts/deploy.js`
- [x] Hardhat config in `/hardhat.config.js`

## 🔧 Setup Environment

### 1. Create `.env.local` file:
```bash
# Copy from .env.example
cp .env.example .env.local
```

### 2. Add your private key and RPC URLs:
```bash
# Your wallet private key (the one that will own the contract)
PRIVATE_KEY=0x1234567890abcdef...

# Infura or Alchemy RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
```

## 🚀 Deploy Contract

### Option 1: Deploy to Sepolia Testnet (Recommended)
```bash
# Compile contract
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### Option 2: Deploy to Local Hardhat Network (Testing)
```bash
# Start local blockchain
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat run scripts/deploy.js --network hardhat
```

### Option 3: Deploy to Mainnet (Production Only)
```bash
# ⚠️ CAUTION: This costs real ETH!
npx hardhat run scripts/deploy.js --network mainnet
```

## 📝 After Deployment

The deployment script will show:
```bash
✅ AuctionSystem deployed successfully!
📝 Contract address: 0x1234567890abcdef...
🔗 Transaction hash: 0xabcdef...
🔍 View on Sepolia Etherscan: https://sepolia.etherscan.io/address/0x...
```

## 🔧 Update Your App Configuration

### 1. Update Contract Config:
Edit `/src/config/contract-config.ts`:
```typescript
sepolia: {
  address: '0xYOUR_NEW_CONTRACT_ADDRESS' as Address,
  chainId: 11155111,
  explorerUrl: 'https://sepolia.etherscan.io',
  deployedBlock: 123456, // Block number from deployment
},
```

### 2. Update Environment:
Edit `.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_NEW_CONTRACT_ADDRESS
```

### 3. Update Database (if needed):
```sql
-- Update any existing auctions to point to new contract
UPDATE auctions SET contract_auction_id = NULL WHERE contract_auction_id IS NOT NULL;
```

## 🧪 Test Your New Contract

### 1. Test with Script:
```bash
# Update the contract address in scripts/test-contract.js
node scripts/test-contract.js
```

### 2. Test with Web Interface:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3001/auctions`
3. Connect wallet (same network as deployment)
4. Create test auction (owner wallet only)
5. Test bidding with different wallet

## 🔍 Verify Contract on Etherscan

### Automatic Verification:
Install hardhat-etherscan plugin:
```bash
npm install --save-dev @nomiclabs/hardhat-etherscan
```

Add to `hardhat.config.js`:
```javascript
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  // ... existing config
  etherscan: {
    apiKey: "YOUR_ETHERSCAN_API_KEY"
  }
};
```

Verify:
```bash
npx hardhat verify --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

## 💡 Using Your Existing Contract

**If you want to keep using your current contract** `0x172084988957cAC63766fa0495f3FfFb89256064`:

1. **No deployment needed** - you already have a working contract
2. **Test it** with: `node scripts/test-contract.js`
3. **Create auctions** using the owner wallet that deployed it
4. **Database is ready** - just run the schema in Supabase

## 📊 Contract Functions Available

### Owner Functions (Contract Deployer Only):
- `createNewAuction(name, initialPrice, duration)`
- `closeAuction(auctionIndex)`
- `withdraw(auctionIndex)`

### Public Functions:
- `sendNewBid(auctionIndex)` [payable]
- `getAuctionDetails(auctionIndex)`
- `getTotalAuctions()`
- `getBidCount(auctionIndex)`

## 🆘 Troubleshooting

### "No Hardhat config file found"
- ✅ **Fixed** - `hardhat.config.js` is now created

### "Network not supported"
- Check your `.env.local` has correct RPC URLs
- Make sure your wallet has ETH for gas fees

### "Only owner can create auction"
- Use the same wallet that deployed the contract
- Or deploy a new contract with your current wallet

### "Transaction reverted"
- Check auction exists and is open
- For bids: ensure amount > current price
- Make sure wallet has enough ETH

## 🎯 Your System is Ready!

With Hardhat properly configured:
- ✅ Deploy new contracts easily
- ✅ Test locally before mainnet
- ✅ Verify contracts on Etherscan  
- ✅ Manage multiple deployments

**Current Status:** Your auction system works with your existing contract `0x172084988957cAC63766fa0495f3FfFb89256064`. Use this guide only if you want to deploy a fresh contract.