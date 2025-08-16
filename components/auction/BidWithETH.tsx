// ETH Bidding Component for Auctions
import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Wallet, AlertTriangle, Pause } from "lucide-react";
import { useAuctionContract } from "@/hooks/useAuctionContract";
import { getContractAddress, formatEth } from "@/lib/web3-config";

// Get Etherscan URL based on chain ID
function getEtherscanUrl(chainId: number | undefined, txHash: string): string {
  switch (chainId) {
    case 1: // Mainnet
      return `https://etherscan.io/tx/${txHash}`;
    case 11155111: // Sepolia
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 137: // Polygon
      return `https://polygonscan.com/tx/${txHash}`;
    case 10: // Optimism
      return `https://optimistic.etherscan.io/tx/${txHash}`;
    case 42161: // Arbitrum
      return `https://arbiscan.io/tx/${txHash}`;
    default:
      return `https://etherscan.io/tx/${txHash}`; // Fallback to mainnet
  }
}

interface BidWithETHProps {
  auctionId: string;
  currentBid: number;
  minimumIncrement: number;
  onChainAuctionId?: number;
  onBidSuccess?: () => void;
  endTime?: string; // Add end time to check if auction has ended
  hasBids?: boolean; // To know if this is the first bid or not
}

export function BidWithETH({
  auctionId,
  currentBid,
  minimumIncrement,
  onChainAuctionId,
  onBidSuccess,
  endTime,
  hasBids,
}: BidWithETHProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    placeBidOnChain,
    getMinimumBid,
    isContractPaused,
    isProcessing,
    error,
    txHash,
  } = useAuctionContract();
  const [bidAmount, setBidAmount] = useState("");
  const [localError, setLocalError] = useState("");
  const [contractMinBid, setContractMinBid] = useState<bigint | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingContractData, setIsLoadingContractData] = useState(false);

  // Load contract data on mount and when onChainAuctionId changes
  useEffect(() => {
    const loadContractData = async () => {
      if (!isConnected || !onChainAuctionId) return;

      setIsLoadingContractData(true);
      try {
        // Check if contract is paused
        const pausedStatus = await isContractPaused();
        setIsPaused(pausedStatus);

        // Get minimum bid from contract if auction exists on-chain
        const minBid = await getMinimumBid(onChainAuctionId);
        setContractMinBid(minBid);
      } catch (error) {
        console.error("Failed to load contract data:", error);
      } finally {
        setIsLoadingContractData(false);
      }
    };

    loadContractData();
  }, [isConnected, onChainAuctionId, isContractPaused, getMinimumBid]);

  // Calculate minimum bid - prefer contract value if available
  const getCalculatedMinimumBid = () => {
    if (contractMinBid) {
      // Use contract minimum bid if available
      return Number(formatEth(contractMinBid));
    }
    // Fallback to frontend calculation
    return hasBids === false ? currentBid : currentBid + minimumIncrement;
  };

  const minimumBid = getCalculatedMinimumBid();
  const contractAddress = chainId ? getContractAddress(chainId) : undefined;
  const isWrongNetwork = isConnected && !contractAddress;

  // Check if auction has ended based on end time
  const hasEnded = endTime ? new Date(endTime).getTime() <= Date.now() : false;

  const handleBid = async () => {
    if (!isConnected) {
      setLocalError("Please connect your wallet first");
      return;
    }

    const bid = parseFloat(bidAmount);
    if (isNaN(bid) || bid < minimumBid) {
      setLocalError(`Minimum bid is ${minimumBid.toFixed(6)} ETH`);
      return;
    }

    setLocalError("");

    try {
      await placeBidOnChain(auctionId, bidAmount, onChainAuctionId);
      setBidAmount("");
      onBidSuccess?.();
    } catch (err: any) {
      console.error("Bidding error:", err);
      let errorMessage = err.message || "Failed to place bid";

      if (errorMessage.includes("Auction ended")) {
        errorMessage = "This auction has ended and no longer accepts bids.";
      } else if (errorMessage.includes("already ended")) {
        errorMessage = "This auction has already ended.";
      }

      setLocalError(errorMessage);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-800/50 rounded-xl border border-darkviolet">
        <div className="text-center space-y-4">
          <Wallet className="w-12 h-12 mx-auto text-violet" />
          <p className="text-gray-300">Connect your wallet to place bids</p>
        </div>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="p-6 bg-orange-900/20 rounded-xl border border-orange-600">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-orange-400" />
          <div>
            <p className="text-orange-400 font-medium">Wrong Network</p>
            <p className="text-gray-300 text-sm mt-2">
              Please switch to Sepolia testnet to place bids.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Current chain: {chainId ? `Chain ${chainId}` : "Unknown"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div className="p-6 bg-orange-900/20 rounded-xl border border-orange-600">
        <div className="text-center space-y-4">
          <Pause className="w-12 h-12 mx-auto text-orange-400" />
          <div>
            <p className="text-orange-400 font-medium">Contract Paused</p>
            <p className="text-gray-300 text-sm mt-2">
              The auction contract is currently paused. Bidding is temporarily
              disabled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasEnded) {
    return (
      <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-600">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-12 h-12 mx-auto text-gray-400" />
          <div>
            <p className="text-gray-400 font-medium">Auction Ended</p>
            <p className="text-gray-500 text-sm mt-2">
              This auction has ended and no longer accepts bids.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Current Bid</p>
          <p className="text-xl font-bold text-violet">{currentBid} ETH</p>
        </div>
        <div>
          <p className="text-gray-400">
            Min {contractMinBid ? "Bid (Contract)" : "Increment"}
          </p>
          <p className="text-xl font-bold text-gray-300">
            {contractMinBid
              ? `${minimumBid.toFixed(6)} ETH`
              : `+${minimumIncrement} ETH`}
          </p>
          {isLoadingContractData && (
            <p className="text-xs text-yellow-400 mt-1">
              Loading contract data...
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          type="number"
          step="0.01"
          min={minimumBid}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder={`Min: ${minimumBid.toFixed(6)} ETH`}
          label="Your Bid (ETH)"
          classNames={{
            input: "bg-gray-800/50 border-gray-600 text-white",
            inputWrapper:
              "bg-gray-800/50 border-gray-600 hover:border-violet focus-within:border-violet",
          }}
          endContent={<span className="text-gray-400 text-sm">ETH</span>}
        />
      </div>

      {(localError || error) && (
        <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
          <p className="text-red-400 text-sm">{localError || error?.message}</p>
          {(localError || error?.message)?.includes("timeout") && (
            <p className="text-red-300 text-xs mt-2">
              💡 Tip: If you're experiencing timeouts, try refreshing the page
              or switching to a different network and back to Sepolia.
            </p>
          )}
        </div>
      )}

      {txHash && (
        <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg">
          <p className="text-green-400 text-sm">
            Transaction submitted:{" "}
            <a
              href={getEtherscanUrl(chainId, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on {chainId === 11155111 ? "Sepolia Etherscan" : "Etherscan"}
            </a>
          </p>
        </div>
      )}

      <Button
        onClick={handleBid}
        disabled={isProcessing || !bidAmount || isLoadingContractData}
        className={`w-full py-6 rounded-full font-medium transition-all ${
          isProcessing || isLoadingContractData
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gradient-to-r from-violet to-purple-600 hover:from-purple-600 hover:to-violet"
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Processing...
          </span>
        ) : isLoadingContractData ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            Loading Contract Data...
          </span>
        ) : (
          `Place Bid: ${bidAmount || minimumBid.toFixed(6)} ETH`
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
      </p>
    </div>
  );
}
