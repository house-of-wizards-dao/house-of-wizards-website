const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Auction System Functionality\n");

  // Get the contract owner account
  const [owner] = await ethers.getSigners();
  console.log("Testing with account:", owner.address);
  console.log("Account balance:", ethers.utils.formatEther(await owner.getBalance()), "ETH\n");

  // Connect to deployed contract
  const contractAddress = "0x59C2745FAe67E10BefB0F0Cf6C2056a724Eb0B71";
  const AuctionSystem = await ethers.getContractFactory("AuctionSystem");
  const contract = AuctionSystem.attach(contractAddress);

  try {
    // Test 1: Get current total auctions
    console.log("📊 Test 1: Getting total auctions...");
    const totalBefore = await contract.getTotalAuctions();
    console.log(`Current total auctions: ${totalBefore.toString()}\n`);

    // Test 2: Create a new auction
    console.log("🎨 Test 2: Creating new test auction...");
    const auctionName = "Test Digital Artwork #" + Date.now();
    const startingPrice = ethers.utils.parseEther("0.5"); // 0.5 ETH
    const duration = 1 * 24 * 60 * 60; // 1 day in seconds

    console.log(`Auction Name: ${auctionName}`);
    console.log(`Starting Price: ${ethers.utils.formatEther(startingPrice)} ETH`);
    console.log(`Duration: ${duration / (24 * 60 * 60)} days`);

    const tx = await contract.createNewAuction(auctionName, startingPrice, duration);
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Auction created successfully!");
    console.log("Block number:", receipt.blockNumber);
    console.log("Gas used:", receipt.gasUsed.toString(), "\n");

    // Test 3: Verify total auctions increased
    console.log("📈 Test 3: Verifying auction count...");
    const totalAfter = await contract.getTotalAuctions();
    console.log(`Total auctions now: ${totalAfter.toString()}`);
    console.log(`Auctions created: ${totalAfter.toNumber() - totalBefore.toNumber()}\n`);

    // Test 4: Get details of the newly created auction
    console.log("🔍 Test 4: Getting auction details...");
    const latestAuctionIndex = totalAfter.toNumber() - 1;
    const auctionDetails = await contract.getAuctionDetails(latestAuctionIndex);
    
    console.log("📋 Latest Auction Details:");
    console.log(`Current Winner: ${auctionDetails.currentWinner}`);
    console.log(`Current Price: ${ethers.utils.formatEther(auctionDetails.currentPrice)} ETH`);
    console.log(`Seconds Remaining: ${auctionDetails.secondsRemaining.toString()}`);
    console.log(`Status: ${auctionDetails.status} (0=Open, 1=Closed, 2=Paid)\n`);

    // Test 5: Get full auction struct
    console.log("📊 Test 5: Getting full auction struct...");
    const fullAuction = await contract.auctions(latestAuctionIndex);
    
    console.log("📋 Full Auction Data:");
    console.log(`Name: ${fullAuction.name}`);
    console.log(`Initial Price: ${ethers.utils.formatEther(fullAuction.initialPrice)} ETH`);
    console.log(`Current Price: ${ethers.utils.formatEther(fullAuction.currentPrice)} ETH`);
    console.log(`Current Bidder: ${fullAuction.bidder}`);
    console.log(`Deadline: ${new Date(fullAuction.deadline.toNumber() * 1000).toLocaleString()}`);
    console.log(`Bid Count: ${fullAuction.bidCount.toString()}`);
    console.log(`Status: ${fullAuction.status}\n`);

    // Test 6: Test bid count functionality
    console.log("🎯 Test 6: Getting bid count...");
    const bidCount = await contract.getBidCount(latestAuctionIndex);
    console.log(`Bid count for auction ${latestAuctionIndex}: ${bidCount.toString()}\n`);

    console.log("🎉 All tests completed successfully!");
    console.log("\n📱 Admin Interface Available at:");
    console.log("http://localhost:3003/admin");
    console.log("\n🔗 Contract Address:", contractAddress);
    console.log("🔗 Contract Owner:", owner.address);

  } catch (error) {
    console.error("❌ Test failed:");
    console.error(error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });