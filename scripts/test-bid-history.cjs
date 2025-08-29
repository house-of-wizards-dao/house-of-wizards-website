// Test script to check if we can fetch bid history from events
const { createPublicClient, http, decodeEventLog, parseAbiItem } = require('viem');
const { sepolia } = require('viem/chains');

const AUCTION_CONTRACT_ADDRESS = '0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71';
const AUCTION_CONTRACT_ABI = [
  {
    name: 'UpdatedBid',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_auctionIndex', type: 'uint256', indexed: false },
      { name: '_newOffer', type: 'uint256', indexed: false },
      { name: '_bidderAddress', type: 'address', indexed: false },
    ],
  },
];

async function main() {
  console.log('🔍 Testing bid history fetching from blockchain events...\n');

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org')
  });

  try {
    console.log('📡 Connected to Sepolia network');
    console.log('🔗 Contract:', AUCTION_CONTRACT_ADDRESS);

    // Get UpdatedBid events
    console.log('\n🔍 Fetching UpdatedBid events...');
    
    const logs = await publicClient.getLogs({
      address: AUCTION_CONTRACT_ADDRESS,
      event: AUCTION_CONTRACT_ABI[0],
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    console.log(`📊 Found ${logs.length} UpdatedBid events total`);

    if (logs.length > 0) {
      console.log('\n🎉 Recent bid events:');
      
      for (let i = 0; i < Math.min(5, logs.length); i++) {
        const log = logs[i];
        
        try {
          const decoded = decodeEventLog({
            abi: AUCTION_CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
            eventName: 'UpdatedBid'
          });

          const auctionIndex = Number(decoded.args._auctionIndex);
          const bidAmount = decoded.args._newOffer;
          const bidder = decoded.args._bidderAddress;

          console.log(`  ${i + 1}. Auction ${auctionIndex}: ${bidAmount.toString()} wei from ${bidder.slice(0, 6)}...${bidder.slice(-4)}`);
          console.log(`     TX: ${log.transactionHash}`);
          console.log(`     Block: ${log.blockNumber}`);
        } catch (decodeError) {
          console.error(`     Failed to decode log ${i + 1}:`, decodeError.message);
        }
      }

      // Filter for auction 2 specifically
      console.log('\n🎯 Events for Auction 2:');
      let auction2Events = 0;
      
      for (const log of logs) {
        try {
          const decoded = decodeEventLog({
            abi: AUCTION_CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
            eventName: 'UpdatedBid'
          });

          if (Number(decoded.args._auctionIndex) === 2) {
            auction2Events++;
            const bidAmount = (Number(decoded.args._newOffer) / 1e18).toFixed(6);
            console.log(`  🏆 Bid: ${bidAmount} ETH from ${decoded.args._bidderAddress.slice(0, 6)}...`);
          }
        } catch (e) {
          // Skip failed decodes
        }
      }

      console.log(`\n📊 Total events for Auction 2: ${auction2Events}`);
    } else {
      console.log('⚠️ No UpdatedBid events found');
      console.log('This might mean:');
      console.log('  1. No bids have been placed yet');
      console.log('  2. Events are not being emitted correctly');
      console.log('  3. RPC endpoint issue');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();