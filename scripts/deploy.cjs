const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AuctionSystem contract...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // Deploy the contract
  const AuctionSystem = await ethers.getContractFactory("AuctionSystem");
  
  console.log("Deploying contract...");
  const auctionSystem = await AuctionSystem.deploy();
  
  console.log("Waiting for deployment confirmation...");
  await auctionSystem.deployed();

  console.log("✅ AuctionSystem deployed successfully!");
  console.log("📝 Contract address:", auctionSystem.address);
  console.log("🔗 Transaction hash:", auctionSystem.deployTransaction.hash);
  console.log("⛽ Gas used:", auctionSystem.deployTransaction.gasLimit.toString());
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
  
  if (network.chainId === 11155111) {
    console.log("🔍 View on Sepolia Etherscan:");
    console.log(`   Contract: https://sepolia.etherscan.io/address/${auctionSystem.address}`);
    console.log(`   Transaction: https://sepolia.etherscan.io/tx/${auctionSystem.deployTransaction.hash}`);
  }

  // Verify basic contract functionality
  console.log("\n🧪 Testing basic contract functions...");
  
  try {
    const totalAuctions = await auctionSystem.getTotalAuctions();
    console.log("✅ getTotalAuctions():", totalAuctions.toString());
    
    // Create a test auction
    console.log("\n🎨 Creating test auction...");
    const tx = await auctionSystem.createNewAuction(
      "Test Digital Artwork",
      ethers.utils.parseEther("1.0"), // 1 ETH starting price
      7 * 24 * 60 * 60 // 7 days duration
    );
    
    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("✅ Test auction created successfully!");
    
    const newTotal = await auctionSystem.getTotalAuctions();
    console.log("✅ Total auctions after creation:", newTotal.toString());
    
  } catch (error) {
    console.log("⚠️ Error testing contract:", error.message);
  }

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Update your frontend config with the contract address above");
  console.log("2. Update NEXT_PUBLIC_CONTRACT_ADDRESS in your .env.local file");
  console.log("3. Update /src/config/contract-config.ts with the deployed address");
  console.log("4. Test the auction system in your web interface");
  
  console.log("\n🎯 Your contract is ready to use!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });