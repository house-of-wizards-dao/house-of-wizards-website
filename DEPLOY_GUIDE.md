# 🚀 Smart Contract Deployment Guide

## Prerequisites

Before deploying the auction smart contract, you need:

1. **Wallet with ETH**: You need ETH on Sepolia testnet for deployment
2. **Private Key**: Export from MetaMask or your wallet
3. **RPC URL**: Get from Infura, Alchemy, or QuickNode
4. **Etherscan API Key**: For contract verification (optional)

## Step 1: Get Sepolia ETH (Test Network)

1. Visit Sepolia Faucet: https://sepoliafaucet.com/
2. Or use Alchemy faucet: https://sepoliafaucet.io/
3. Enter your wallet address and request ETH
4. Wait for confirmation (usually 1-2 minutes)

## Step 2: Get RPC URL

### Option A: Infura (Recommended)
1. Sign up at https://infura.io/
2. Create a new project
3. Copy the Sepolia endpoint URL
4. It looks like: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### Option B: Alchemy
1. Sign up at https://alchemy.com/
2. Create a new app (select Sepolia network)
3. Copy the HTTP endpoint

## Step 3: Get Your Private Key

⚠️ **SECURITY WARNING**: Never share or commit your private key!

### From MetaMask:
1. Open MetaMask
2. Click the three dots menu
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter password and copy the key

## Step 4: Configure Environment

Add these to your `.env.local` file:

```bash
# Deployment Configuration
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key_here  # Optional, for verification

# Web3 Frontend Configuration (already added)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Step 5: Compile the Contract

```bash
npx hardhat compile
```

This will compile `contracts/HybridAuctionHouse.sol`

## Step 6: Deploy to Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Expected output:
```
🚀 Starting deployment of HybridAuctionHouse...
📍 Deploying contracts with account: 0x...
💰 Account balance: X.XX ETH
📝 Deploying HybridAuctionHouse contract...
✅ HybridAuctionHouse deployed to: 0x...CONTRACT_ADDRESS
🌐 Network: sepolia (Chain ID: 11155111)
💾 Deployment info saved to: ./deployments/deployment-11155111-XXX.json
```

## Step 7: Update Frontend Configuration

After deployment, update `lib/web3-config.ts`:

```typescript
export const AUCTION_CONTRACT_ADDRESS = {
  11155111: '0x...YOUR_DEPLOYED_CONTRACT_ADDRESS', // <-- Add this
}
```

## Step 8: Verify on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

## Step 9: Test the Contract

1. Visit your contract on Sepolia Etherscan
2. Go to "Contract" tab → "Write Contract"
3. Connect your wallet
4. Try creating an auction with `createAuction`

## Deployment Costs

- **Sepolia (Testnet)**: Free (use test ETH)
- **Ethereum Mainnet**: ~$100-500 depending on gas prices
- **Polygon**: ~$1-5
- **Arbitrum/Optimism**: ~$5-20

## Troubleshooting

### "Insufficient funds"
- Make sure you have enough ETH in your wallet
- For Sepolia, get more from the faucet

### "Invalid RPC URL"
- Check your SEPOLIA_RPC_URL is correct
- Make sure there are no extra spaces

### "Transaction underpriced"
- Network is congested, try increasing gas price
- Or wait and try again later

### "ENOENT: no such file or directory"
- Make sure you're in the project root directory
- Run `pwd` to check current directory

## Next Steps

After successful deployment:

1. ✅ Contract is live on Sepolia
2. ✅ Update `web3-config.ts` with address
3. ✅ Test wallet connection in your app
4. ✅ Try placing a test bid

## Production Deployment

For mainnet deployment:
1. Change network to `mainnet` in command
2. Ensure you have real ETH (not test ETH)
3. Double-check all contract code
4. Consider getting an audit for large projects

---

Need help? Check the contract at:
- Sepolia: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS`
- Docs: https://hardhat.org/tutorial/deploying-to-a-live-network