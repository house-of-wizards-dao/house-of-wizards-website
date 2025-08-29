const { ethers } = require("hardhat");

async function main() {
  console.log("🎨 Creating new auction...\n");

  // Get the contract owner account
  const [owner] = await ethers.getSigners();
  console.log("Creating with account:", owner.address);

  // Connect to deployed contract
  const contractAddress = "0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71";
  const AuctionSystem = await ethers.getContractFactory("AuctionSystem");
  const contract = AuctionSystem.attach(contractAddress);

  // Auction parameters
  const auctionName = "Digital Art Masterpiece";
  const startingPrice = ethers.utils.parseEther("2.0"); // 2 ETH
  const duration = 7 * 24 * 60 * 60; // 7 days in seconds

  console.log(`Auction Name: ${auctionName}`);
  console.log(`Starting Price: ${ethers.utils.formatEther(startingPrice)} ETH`);
  console.log(`Duration: ${duration / (24 * 60 * 60)} days\n`);

  try {
    // Create the auction
    const tx = await contract.createNewAuction(auctionName, startingPrice, duration);
    console.log("Transaction sent:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Auction created successfully!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString());

    // Get total auctions to verify
    const totalAuctions = await contract.getTotalAuctions();
    console.log(`\nTotal auctions now: ${totalAuctions.toString()}`);

    // Get the latest auction details
    const latestAuctionIndex = totalAuctions.toNumber() - 1;
    const auctionDetails = await contract.getAuctionDetails(latestAuctionIndex);
    
    console.log("\n📋 New Auction Details:");
    console.log(`Current Winner: ${auctionDetails.currentWinner}`);
    console.log(`Current Price: ${ethers.utils.formatEther(auctionDetails.currentPrice)} ETH`);
    console.log(`Seconds Remaining: ${auctionDetails.secondsRemaining.toString()}`);
    console.log(`Status: ${auctionDetails.status} (0=Open, 1=Closed, 2=Paid)`);

  } catch (error) {
    console.error("❌ Failed to create auction:");
    console.error(error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });