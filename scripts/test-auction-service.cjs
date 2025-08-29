// Test script to verify the auction service works
const { createPublicClient, http } = require('viem');
const { sepolia } = require('viem/chains');

// Contract address and ABI
const AUCTION_CONTRACT_ADDRESS = '0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71';
const AUCTION_CONTRACT_ABI = [
  {
    name: 'getTotalAuctions',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'auctions',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'initialPrice', type: 'uint256' },
      { name: 'currentPrice', type: 'uint256' },
      { name: 'bidder', type: 'address' },
      { name: 'deadline', type: 'uint256' },
      { name: 'bidCount', type: 'uint256' },
      { name: 'status', type: 'uint8' },
    ],
  },
  {
    name: 'getAuctionDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_id', type: 'uint256' }],
    outputs: [
      { name: 'currentWinner', type: 'address' },
      { name: 'currentPrice', type: 'uint256' },
      { name: 'secondsRemaining', type: 'uint256' },
      { name: 'status', type: 'uint8' },
    ],
  },
];

async function testAuctionService() {
  console.log('🧪 Testing Contract Auction Service\n');
  
  try {
    // Create public client
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org')
    });

    console.log('✅ Created public client');
    console.log('🔗 Contract Address:', AUCTION_CONTRACT_ADDRESS);
    
    // Test 1: Get total auctions
    console.log('\n📊 Test 1: Getting total auctions...');
    const totalAuctions = await publicClient.readContract({
      address: AUCTION_CONTRACT_ADDRESS,
      abi: AUCTION_CONTRACT_ABI,
      functionName: 'getTotalAuctions',
    });
    
    console.log(`Total auctions: ${totalAuctions.toString()}`);
    
    if (Number(totalAuctions) === 0) {
      console.log('⚠️ No auctions found in contract');
      return;
    }
    
    // Test 2: Get auction details for each auction
    for (let i = 0; i < Number(totalAuctions); i++) {
      console.log(`\n🔍 Test 2.${i + 1}: Getting auction ${i} details...`);
      
      // Get auction struct
      const auctionStruct = await publicClient.readContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: 'auctions',
        args: [BigInt(i)],
      });
      
      console.log(`📋 Auction ${i} Struct:`);
      console.log(`  Name: ${auctionStruct[0]}`);
      console.log(`  Initial Price: ${auctionStruct[1].toString()} wei`);
      console.log(`  Current Price: ${auctionStruct[2].toString()} wei`);
      console.log(`  Bidder: ${auctionStruct[3]}`);
      console.log(`  Deadline: ${new Date(Number(auctionStruct[4]) * 1000).toISOString()}`);
      console.log(`  Bid Count: ${auctionStruct[5].toString()}`);
      console.log(`  Status: ${auctionStruct[6]} (0=Open, 1=Closed, 2=Paid)`);
      
      // Get auction details
      const auctionDetails = await publicClient.readContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: 'getAuctionDetails',
        args: [BigInt(i)],
      });
      
      console.log(`📋 Auction ${i} Details:`);
      console.log(`  Current Winner: ${auctionDetails[0]}`);
      console.log(`  Current Price: ${auctionDetails[1].toString()} wei`);
      console.log(`  Seconds Remaining: ${auctionDetails[2].toString()}`);
      console.log(`  Status: ${auctionDetails[3]} (0=Open, 1=Closed, 2=Paid)`);
    }
    
    console.log('\n🎉 Contract service test completed successfully!');
    console.log('\n📱 Check auctions page at: http://localhost:3002/auctions');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

testAuctionService();