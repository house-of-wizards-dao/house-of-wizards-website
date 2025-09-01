# 🎯 Complete Auction System Setup Guide

## 📋 Quick Start Checklist

### ✅ **What's Already Done**
- [x] **Smart Contract ABI** - Integrated your real contract
- [x] **Frontend Components** - Complete auction UI with bidding interface
- [x] **Database Schema** - Ready to deploy to Supabase
- [x] **Web3 Integration** - RainbowKit + Wagmi hooks for contract interaction
- [x] **Admin Panel** - Auction management dashboard
- [x] **API Endpoints** - Backend routes for auction operations

### 🚀 **What You Need to Do**

## 1. **Deploy Your Smart Contract**

### **Option A: Using Hardhat**
```bash
# Install Hardhat if not already installed
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Create Hardhat project (if not exists)
npx hardhat

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### **Option B: Using Remix IDE**
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file `AuctionSystem.sol`
3. Paste your contract code
4. Compile with Solidity 0.8.24
5. Deploy to Sepolia testnet
6. **Save the contract address!**

### **Option C: Using Foundry**
```bash
# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy contract
forge create --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key YOUR_PRIVATE_KEY \
  src/AuctionSystem.sol:AuctionSystem
```

## 2. **Configure Contract Address**

After deployment, update the contract configuration:

**File: `/src/config/contract-config.ts`**
```typescript
export const CONTRACT_CONFIGS: Record<string, ContractConfig> = {
  sepolia: {
    address: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS' as Address, // 👈 UPDATE THIS
    chainId: 11155111,
    explorerUrl: 'https://sepolia.etherscan.io',
    deployedBlock: 123456, // 👈 ADD DEPLOYMENT BLOCK NUMBER
  },
};
```

## 3. **Environment Configuration**

**Create/Update `.env.local`:**
```bash
# Contract Configuration
NEXT_PUBLIC_CONTRACT_NETWORK=sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: RPC URLs for better performance
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
NEXT_PUBLIC_INFURA_KEY=your_infura_key
```

## 4. **Deploy Database Schema**

1. **Open Supabase Dashboard** → SQL Editor
2. **Copy and paste** the entire content from `/database/auction-system-schema.sql`
3. **Click Run** to create all tables
4. **Verify** tables created: `artworks`, `auctions`, `bids`, etc.

## 5. **Test the System**

### **Frontend Testing:**
1. **Start dev server:** `npm run dev`
2. **Visit:** http://localhost:3001/auctions
3. **Connect wallet** (make sure it's on Sepolia testnet)
4. **Test auction creation** (requires contract owner wallet)

### **Contract Owner Functions:**
```typescript
// Only the contract deployer can call these functions:
- createNewAuction(name, initialPrice, durationInSeconds)
- closeAuction(auctionIndex)
- withdraw(auctionIndex)
```

### **Public Functions:**
```typescript
// Anyone can call these:
- sendNewBid(auctionIndex) [payable - send ETH]
- getAuctionDetails(auctionIndex)
- getTotalAuctions()
- getBidCount(auctionIndex)
```

## 6. **Create Your First Auction**

### **Method 1: Through Web Interface (Recommended)**
1. **Visit:** http://localhost:3001/admin
2. **Login** with admin account
3. **Go to Auction Management**
4. **Click "Create New Auction"**
5. **Fill form and submit**

### **Method 2: Direct Contract Call**
```javascript
// Using the admin panel or direct Web3 interaction
const { createAuction } = useCreateAuction();

await createAuction(
  "My First Artwork Auction",    // name
  "1.0",                         // initial price (1 ETH)
  7 * 24 * 60 * 60              // duration (7 days in seconds)
);
```

### **Method 3: Using Etherscan**
1. Go to your contract on Sepolia Etherscan
2. Connect wallet in "Write Contract" tab
3. Call `createNewAuction` function
4. Enter: name, initialPrice (in wei), durationInSeconds

## 7. **Understanding Your Contract**

### **Key Contract Features:**
- **Owner-only auction creation** - Only deployer can create auctions
- **Automatic refunds** - Previous bidders get automatically refunded
- **Auction auto-close** - Auctions close when time expires
- **Secure withdrawals** - Owner can withdraw winning bids

### **Contract State:**
```solidity
enum AuctionStatus { Open, Closed, Payed }
// Open (0)   - Active, accepting bids
// Closed (1) - Ended, owner can withdraw
// Payed (2)  - Owner has withdrawn funds
```

## 8. **Production Deployment**

### **For Mainnet:**
1. **Deploy contract** to Ethereum mainnet
2. **Update contract config** to use mainnet settings
3. **Test with small amounts** first
4. **Set up monitoring** for events and transactions

### **Security Checklist:**
- ✅ Contract audited and tested
- ✅ Use hardware wallet for contract owner
- ✅ Set reasonable auction durations
- ✅ Monitor for unusual activity
- ✅ Have emergency procedures ready

## 🛠️ **Troubleshooting**

### **Common Issues:**

**"Contract not found"**
- Verify contract address in config
- Make sure wallet is on correct network
- Check contract is actually deployed

**"Only owner can create auction"**
- Use the same wallet that deployed the contract
- Or deploy a new contract if needed

**"Insufficient funds"**
- Ensure wallet has enough ETH for gas
- For bidding, need enough ETH for bid amount + gas

**"Transaction reverted"**
- Check auction is still open (status = 0)
- For bids, ensure amount > current bid
- For owner functions, use deployer wallet

### **Getting Help:**
- Check browser console for errors
- Use Sepolia Etherscan to view transactions
- Verify contract state using read functions
- Test individual functions before full integration

## 📊 **Current System Status**

**✅ Ready Components:**
- Smart contract integration hooks
- Complete UI/UX for auctions and bidding
- Database schema for auction metadata
- Admin panel for management
- Real-time event listening
- Mobile-responsive design

**🔧 **Next Steps:**
1. Deploy your contract to Sepolia
2. Update contract address in config
3. Create your first test auction
4. Invite users to test bidding
5. Deploy to production when ready!

---

**🎉 Your auction system is ready to go live!** Just deploy the contract and update the address. Everything else is already built and working.