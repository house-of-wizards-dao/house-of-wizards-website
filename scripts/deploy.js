const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of HybridAuctionHouse...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  
  // Check account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy the contract
  console.log("📝 Deploying SecureHybridAuctionHouse contract...");
  const HybridAuctionHouse = await hre.ethers.getContractFactory("SecureHybridAuctionHouse");
  const auctionHouse = await HybridAuctionHouse.deploy();

  // Wait for deployment
  await auctionHouse.waitForDeployment();
  const contractAddress = await auctionHouse.getAddress();

  console.log("✅ HybridAuctionHouse deployed to:", contractAddress);
  
  // Get network name
  const network = await hre.ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString(), ")");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    contract: "SecureHybridAuctionHouse",
    address: contractAddress,
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: auctionHouse.deploymentTransaction().hash
  };

  // Save to file
  const deploymentsPath = "./deployments";
  if (!fs.existsSync(deploymentsPath)) {
    fs.mkdirSync(deploymentsPath);
  }
  
  const filename = `${deploymentsPath}/deployment-${network.chainId}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", filename);

  // Update web3-config.ts with the new address
  console.log("\n📋 Next steps:");
  console.log("1. Update lib/web3-config.ts with the contract address:");
  console.log(`   ${network.chainId}: '${contractAddress}',`);
  
  if (network.chainId === 11155111n) { // Sepolia
    console.log("\n2. Verify the contract on Etherscan:");
    console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
    console.log("\n3. View on Sepolia Etherscan:");
    console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);
  }
  
  console.log("\n✨ Deployment complete!");
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });