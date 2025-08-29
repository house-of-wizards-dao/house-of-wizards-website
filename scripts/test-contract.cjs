// Simple script to test your deployed auction contract
// Run with: node scripts/test-contract.js

const { ethers } = require('ethers');

// Your deployed contract details
const CONTRACT_ADDRESS = '0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71';
const SEPOLIA_RPC = 'https://rpc.sepolia.org'; // Public Sepolia RPC

// Minimal ABI for testing
const CONTRACT_ABI = [
    'function getTotalAuctions() view returns (uint256)',
    'function auctions(uint256) view returns (string name, uint256 initialPrice, uint256 currentPrice, address bidder, uint256 deadline, uint256 bidCount, uint8 status)',
    'function getAuctionDetails(uint256 _id) view returns (address currentWinner, uint256 currentPrice, uint256 secondsRemaining, uint8 status)',
    'function createNewAuction(string memory _name, uint256 _initialPrice, uint256 _durationInSeconds)',
    'function sendNewBid(uint256 _auctionIndex) payable',
    'event CreateAuction(string _name, uint256 _initialPrice)',
    'event UpdatedBid(uint256 _auctionIndex, uint256 _newOffer, address _bidderAddress)',
];

async function testContract() {
    try {
        console.log('🔍 Testing Contract at:', CONTRACT_ADDRESS);
        console.log('📡 Network: Sepolia Testnet\n');

        // Create provider (read-only) - ethers v5 syntax
        const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // Test 1: Get total auctions
        console.log('📊 Getting total auctions...');
        const totalAuctions = await contract.getTotalAuctions();
        console.log(`   Total auctions: ${totalAuctions.toString()}\n`);

        // Test 2: Get auction details (if any exist)
        if (totalAuctions > 0) {
            console.log('🏛️ Getting first auction details...');
            const auctionStruct = await contract.auctions(0);
            console.log(`   Name: ${auctionStruct.name}`);
            console.log(`   Initial Price: ${ethers.utils.formatEther(auctionStruct.initialPrice)} ETH`);
            console.log(`   Current Price: ${ethers.utils.formatEther(auctionStruct.currentPrice)} ETH`);
            console.log(`   Current Bidder: ${auctionStruct.bidder}`);
            console.log(`   Deadline: ${new Date(auctionStruct.deadline * 1000).toLocaleString()}`);
            console.log(`   Bid Count: ${auctionStruct.bidCount.toString()}`);
            console.log(`   Status: ${auctionStruct.status} (0=Open, 1=Closed, 2=Paid)\n`);

            // Test 3: Get auction details via function
            const details = await contract.getAuctionDetails(0);
            console.log('📋 Auction Details Function:');
            console.log(`   Current Winner: ${details.currentWinner}`);
            console.log(`   Current Price: ${ethers.utils.formatEther(details.currentPrice)} ETH`);
            console.log(`   Seconds Remaining: ${details.secondsRemaining.toString()}`);
            console.log(`   Status: ${details.status}\n`);
        } else {
            console.log('ℹ️  No auctions created yet.\n');
        }

        console.log('✅ Contract test completed successfully!');
        console.log('🎯 Contract is deployed and accessible.');
        console.log('📝 Next step: Update your frontend to create test auctions.');

    } catch (error) {
        console.error('❌ Contract test failed:');
        console.error(error.message);
        
        if (error.code === 'CALL_EXCEPTION') {
            console.log('\n🔧 Troubleshooting:');
            console.log('   - Verify contract address is correct');
            console.log('   - Check if contract is deployed on Sepolia');
            console.log('   - Ensure RPC URL is working');
            console.log('   - Contract might not be verified on Etherscan yet');
        }
    }
}

// Helper function to create auction (requires private key)
async function createTestAuction() {
    // Uncomment and add your private key to test auction creation
    // const PRIVATE_KEY = 'your-private-key-here'; // Contract owner's key
    // const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    // const contractWithSigner = contract.connect(wallet);
    // 
    // const tx = await contractWithSigner.createNewAuction(
    //     'Test Digital Art',
    //     ethers.utils.parseEther('1.0'), // 1 ETH starting price
    //     7 * 24 * 60 * 60 // 7 days
    // );
    // 
    // console.log('Transaction sent:', tx.hash);
    // await tx.wait();
    // console.log('Auction created successfully!');
    
    console.log('⚠️  Uncomment and configure createTestAuction function to test auction creation');
}

if (require.main === module) {
    testContract();
}

module.exports = { testContract, CONTRACT_ADDRESS, CONTRACT_ABI };