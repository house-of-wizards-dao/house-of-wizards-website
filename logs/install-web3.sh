#!/bin/bash

# Install Web3 dependencies for auction house
echo "📦 Installing Web3 dependencies..."

# Core Web3 libraries
npm install --save \
  ethers@^6.13.0 \
  wagmi@^2.5.0 \
  viem@^2.7.0 \
  @rainbow-me/rainbowkit@^2.0.0 \
  @tanstack/react-query@^5.28.0

# Types for TypeScript
npm install --save-dev \
  @types/react@^18.2.0

echo "✅ Web3 dependencies installed!"
echo ""
echo "Installed packages:"
echo "- ethers: Ethereum library for interacting with blockchain"
echo "- wagmi: React hooks for Ethereum"
echo "- viem: TypeScript-first Ethereum library"
echo "- @rainbow-me/rainbowkit: Wallet connection UI"
echo "- @tanstack/react-query: Required by RainbowKit"
echo ""
echo "Next steps:"
echo "1. Configure Web3 providers in _app.tsx"
echo "2. Add wallet connect button to navbar"
echo "3. Implement bidding with ETH"