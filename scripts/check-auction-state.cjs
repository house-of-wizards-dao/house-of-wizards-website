const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking current auction states...\n");

  // Connect to deployed contract
  const contractAddress = "0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71";
  const AuctionSystem = await ethers.getContractFactory("AuctionSystem");
  const contract = AuctionSystem.attach(contractAddress);

  try {
    const totalAuctions = await contract.getTotalAuctions();
    console.log(`📊 Total auctions: ${totalAuctions.toString()}\n`);

    for (let i = 0; i < totalAuctions; i++) {
      console.log(`🎨 Auction ${i}:`);
      
      // Get auction struct
      const auction = await contract.auctions(i);
      console.log(`  Name: ${auction.name}`);
      console.log(`  Initial Price: ${ethers.utils.formatEther(auction.initialPrice)} ETH`);
      console.log(`  Current Price: ${ethers.utils.formatEther(auction.currentPrice)} ETH`);
      console.log(`  Current Bidder: ${auction.bidder}`);
      console.log(`  Bid Count: ${auction.bidCount.toString()}`);
      console.log(`  Status: ${auction.status} (0=Open, 1=Closed, 2=Paid)`);
      console.log(`  Deadline: ${new Date(auction.deadline.toNumber() * 1000).toLocaleString()}`);
      
      // Get detailed info
      const details = await contract.getAuctionDetails(i);
      console.log(`  Seconds Remaining: ${details.secondsRemaining.toString()}`);
      
      // Check if there's a winner
      if (auction.bidder !== "0x0000000000000000000000000000000000000000") {
        console.log(`  🏆 Current Winner: ${auction.bidder.slice(0, 6)}...${auction.bidder.slice(-4)}`);
        console.log(`  💰 Winning Bid: ${ethers.utils.formatEther(auction.currentPrice)} ETH`);
      } else {
        console.log(`  📝 No bids yet`);
      }
      
      console.log(""); // Empty line for readability
    }

    console.log("✅ Auction state check completed!\n");

  } catch (error) {
    console.error("❌ Failed to check auction state:");
    console.error(error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });