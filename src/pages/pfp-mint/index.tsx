"use client";

import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { parseEther, formatEther, type Address } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Snowfall from "react-snowfall";
import DefaultLayout from "@/layouts/default";
import ErrorBoundary from "@/components/ErrorBoundary";
import WizardBrowser from "@/components/WizardBrowser";
import { addresses } from "@/config/addresses";

const getWizardImage = (idx: number): string => {
  return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${idx}.png`;
};

// Mint price in wei (0.00069 ETH = 690000000000000 wei)
const MINT_PRICE_WEI = parseEther("0.0069");

// PFP Mint Contract ABI
const PFP_MINT_ABI = [
  {
    inputs: [
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export default function PfpMintPage() {
  const [isClient, setIsClient] = useState(false);
  const [snowflakes, setSnowflakes] = useState<HTMLImageElement[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [showMintOverlay, setShowMintOverlay] = useState(false);
  const [currentWizardIndex, setCurrentWizardIndex] = useState(0);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectChain = chainId === baseSepolia.id;
  const { switchChain } = useSwitchChain();

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleMint = () => {
    if (
      !isConnected ||
      !address ||
      !isCorrectChain ||
      selectedTokens.length === 0
    ) {
      return;
    }

    const tokenIds = selectedTokens.map((id) => BigInt(id));
    const totalPrice = MINT_PRICE_WEI * BigInt(selectedTokens.length);

    writeContract({
      address: addresses.pfpMint as Address,
      abi: PFP_MINT_ABI,
      functionName: "mint",
      args: [tokenIds],
      value: totalPrice,
      chainId: baseSepolia.id,
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setShowMintOverlay(true);
    }
  }, [isConfirmed]);

  // Automatically switch to Base Sepolia when page loads and wallet is connected
  useEffect(() => {
    if (isConnected && chainId !== baseSepolia.id && switchChain) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [isConnected, chainId, switchChain]);

  useEffect(() => {
    setIsClient(true);

    // Create snowflake images only on the client side
    const snowflake1 = document.createElement("img");
    snowflake1.src = "/img/snow/1.svg";
    const snowflake2 = document.createElement("img");
    snowflake2.src = "/img/snow/2.svg";
    const snowflake3 = document.createElement("img");
    snowflake3.src = "/img/snow/3.svg";
    const snowflake4 = document.createElement("img");
    snowflake4.src = "/img/snow/4.svg";
    const snowflake5 = document.createElement("img");
    snowflake5.src = "/img/snow/5.svg";
    const snowflake6 = document.createElement("img");
    snowflake6.src = "/img/snow/6.svg";

    setSnowflakes([
      snowflake1,
      snowflake2,
      snowflake3,
      snowflake4,
      snowflake5,
      snowflake6,
    ]);
  }, []);

  return (
    <DefaultLayout>
      {isClient && snowflakes.length > 0 && (
        <Snowfall
          color="#FFFFFF"
          snowflakeCount={200}
          speed={[0.5, 1.5]}
          images={snowflakes}
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
          }}
          radius={[2, 20]}
        />
      )}
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Error Loading Page
                </h2>
                <p className="text-gray-400 mb-6">
                  There was an error loading the wizards page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Wizzy PFP by Shadows
              </h1>
              {isClient && <ConnectButton />}
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col flex-1 max-w-3xl items-center">
                <p className="text-gray-300 text-lg leading-relaxed mb-3">
                  As the winter solstice brings this magical moment to our
                  doorstep like a precious gift, let's celebrate our creative
                  minds and the wondrous journey we've embarked upon together.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-3">
                  These tokens are{" "}
                  <span className="font-semibold text-violet">soulbound</span> —
                  forever connected to their wizards—and will find their home in
                  the backpack wallet of each respective wizard. Best of all?
                  It's{" "}
                  <span className="font-semibold text-violet">
                    {formatEther(MINT_PRICE_WEI)} ETH
                  </span>
                  , making this celebration accessible to all who wish to join
                  the magic.
                </p>
                <div className="my-8 w-full max-w-md p-6 rounded-lg border border-gray-300/60 shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="text-gray-300">
                      <span className="text-lg font-semibold">
                        {selectedTokens.length}
                      </span>{" "}
                      token{selectedTokens.length !== 1 ? "s" : ""} selected
                    </div>
                    <div className="text-white text-2xl font-bold">
                      Total:{" "}
                      {formatEther(
                        MINT_PRICE_WEI * BigInt(selectedTokens.length || 0),
                      )}{" "}
                      ETH
                    </div>
                    {writeError && (
                      <div className="text-red-400 text-sm">
                        Error: {writeError.message}
                      </div>
                    )}
                    <button
                      className="w-full bg-violet hover:bg-violet/80 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        selectedTokens.length === 0 ||
                        !isConnected ||
                        !isCorrectChain ||
                        isPending ||
                        isConfirming
                      }
                      onClick={handleMint}
                    >
                      {isPending || isConfirming
                        ? "Minting..."
                        : isConfirmed
                          ? "Minted!"
                          : "Mint"}
                    </button>
                    {!isConnected && (
                      <p className="text-yellow-400 text-sm mt-2">
                        Please connect your wallet to mint
                      </p>
                    )}
                    {isConnected && !isCorrectChain && (
                      <p className="text-yellow-400 text-sm mt-2">
                        Please switch to Base Sepolia
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Below, you can select the wizards you want to mint the PFP
                  for.
                </p>
              </div>
              <div className="flex-shrink-0 p-4 bg-gradient-to-br from-gray-100/40 to-gray-200/40 rounded-lg border-4 border-gray-300/60 shadow-2xl">
                <div className="p-2 bg-gradient-to-br from-gray-200/30 to-gray-100/30 rounded border-2 border-gray-300/50">
                  <Image
                    src="/img/brekk.png"
                    alt="Wizard PFP Example"
                    width={400}
                    height={400}
                    className="rounded border-2 border-gray-400/40 shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>
          {isClient && (
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
              <WizardBrowser
                selectedTokens={selectedTokens}
                setSelectedTokens={setSelectedTokens}
              />
            </div>
          )}
        </div>
      </ErrorBoundary>

      {/* Mint Success Overlay */}
      {showMintOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mint-overlay-title"
        >
          <button
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowMintOverlay(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowMintOverlay(false);
              }
            }}
            aria-label="Close overlay"
            tabIndex={-1}
          />
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-violet/50 shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto z-10">
            <button
              onClick={() => setShowMintOverlay(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-8">
              <h2
                id="mint-overlay-title"
                className="text-4xl font-bold text-white mb-4"
              >
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-xl text-gray-300">
                You've successfully minted {selectedTokens.length} PFPWizard
                {selectedTokens.length !== 1 ? "s" : ""}!
              </p>
            </div>

            {selectedTokens.length > 0 && (
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-md rounded-lg border-2 border-violet/30 bg-gray-800/50 overflow-hidden">
                  <div className="w-full aspect-square bg-black/40 relative">
                    <Image
                      src={getWizardImage(selectedTokens[currentWizardIndex])}
                      alt={`Wizard #${selectedTokens[currentWizardIndex]}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-white font-semibold text-xl">
                      #{selectedTokens[currentWizardIndex]}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {currentWizardIndex + 1} of {selectedTokens.length}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentWizardIndex((prev) =>
                        prev > 0 ? prev - 1 : selectedTokens.length - 1,
                      )
                    }
                    className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    aria-label="Previous wizard"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentWizardIndex((prev) =>
                        prev < selectedTokens.length - 1 ? prev + 1 : 0,
                      )
                    }
                    className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    aria-label="Next wizard"
                  >
                    Next
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowMintOverlay(false)}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}
