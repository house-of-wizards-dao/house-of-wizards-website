"use client";

import { useState, useEffect, useRef } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { base } from "wagmi/chains";
import { parseEther, formatEther, type Address } from "viem";
import Image from "next/image";
import Snowfall from "react-snowfall";
import { addresses } from "@/config/addresses";
import { wizzyPfpAbi } from "@/config/wizzyPfpAbi";
import { WizardBrowser } from "@/components/browser/WizardBrowser";

const getWizardImage = (idx: number): string => {
  return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${idx}.png`;
};

const MINT_PRICE_WEI = parseEther("0.00069");

interface PfpMintClientProps {
  initialMintedTokenIds: number[];
}

export function PfpMintClient({ initialMintedTokenIds }: PfpMintClientProps) {
  const [snowflakes, setSnowflakes] = useState<HTMLImageElement[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const [showMintOverlay, setShowMintOverlay] = useState(false);
  const [currentWizardIndex, setCurrentWizardIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isReVerifying, setIsReVerifying] = useState(false);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [mintedTokenIds, setMintedTokenIds] = useState<number[]>(
    initialMintedTokenIds,
  );
  const verifiedHashes = useRef<Set<string>>(new Set());

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isCorrectChain = chainId === base.id;
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
      abi: wizzyPfpAbi,
      functionName: "revealTokens",
      args: [tokenIds],
      value: totalPrice,
      chainId: base.id,
    });
  };

  useEffect(() => {
    if (
      isConfirmed &&
      hash &&
      selectedTokens.length > 0 &&
      !isVerifying &&
      !verifiedHashes.current.has(hash)
    ) {
      verifiedHashes.current.add(hash);
      const tokensToVerify = [...selectedTokens];
      const verifyMint = async () => {
        setIsVerifying(true);
        try {
          const response = await fetch("/api/verify-mint", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ids: tokensToVerify,
            }),
          });
          await response.json();
        } catch (error) {
          console.error("@@@ Failed to verify mint:", error);
        } finally {
          setIsVerifying(false);
          setShowMintOverlay(true);
          try {
            const mintedResponse = await fetch("/api/wizzy-pfp/minted");
            if (mintedResponse.ok) {
              const mintedData = await mintedResponse.json();
              setMintedTokenIds(mintedData.ids || []);
            }
          } catch (error) {
            console.error("Failed to refresh minted tokens:", error);
          }
        }
      };

      verifyMint();
    }
  }, [isConfirmed, hash, selectedTokens, isVerifying]);

  useEffect(() => {
    if (isConnected && chainId !== base.id && switchChain) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chainId, switchChain]);

  useEffect(() => {
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
    <>
      {snowflakes.length > 0 && (
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Wizzy PFP by Shadows
            </h1>
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
                the backpack wallet of each respective wizard. Best of all? It's{" "}
                <span className="font-semibold text-violet">
                  {formatEther(MINT_PRICE_WEI)} ETH
                </span>
                , making this celebration accessible to all who wish to join the
                magic.
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
                      isConfirming ||
                      isVerifying
                    }
                    onClick={handleMint}
                  >
                    {isPending || isConfirming
                      ? "Minting..."
                      : isVerifying
                        ? "Verifying..."
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
                Below, you can select the wizards you want to mint the PFP for.
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
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          <WizardBrowser
            disabledTokenIds={mintedTokenIds}
            selectedTokens={selectedTokens}
            setSelectedTokens={setSelectedTokens}
          />
        </div>
      </div>

      {showMintOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mint-overlay-title"
        >
          <button
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowMintOverlay(false);
              setSelectedTokens([]);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowMintOverlay(false);
                setSelectedTokens([]);
              }
            }}
            aria-label="Close overlay"
            tabIndex={-1}
          />
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-violet/50 shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto z-10">
            <button
              onClick={() => {
                setShowMintOverlay(false);
                setSelectedTokens([]);
              }}
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
                    <MintedImage
                      key={imageRefreshKey}
                      tokenId={selectedTokens[currentWizardIndex]}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-white font-semibold text-xl">
                      #{selectedTokens[currentWizardIndex]}
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      {currentWizardIndex + 1} of {selectedTokens.length}
                    </div>
                    <button
                      onClick={async () => {
                        setIsReVerifying(true);
                        try {
                          await fetch("/api/verify-mint", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              ids: selectedTokens,
                            }),
                          });
                          setImageRefreshKey((k) => k + 1);
                        } finally {
                          setIsReVerifying(false);
                        }
                      }}
                      disabled={isReVerifying}
                      className="mt-3 text-gray-400 hover:text-violet text-sm underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      {isReVerifying && (
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      {isReVerifying ? "Refreshing..." : "Missing image?"}
                    </button>
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
                onClick={() => {
                  setShowMintOverlay(false);
                  setSelectedTokens([]);
                }}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-3 px-8 rounded-lg transition-colors text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const MintedImage = ({ tokenId }: { tokenId: number }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUri = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/wizzy-pfp/${tokenId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch image for token ${tokenId}`);
        }
        const data = await response.json();
        setImageUri(data.image);
      } catch (err) {
        console.error("Failed to load image:", err);
        setError(err instanceof Error ? err.message : "Failed to load image");
        setImageUri(getWizardImage(tokenId));
      } finally {
        setIsLoading(false);
      }
    };

    fetchImageUri();
  }, [tokenId]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error && !imageUri) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <Image
      src={imageUri || getWizardImage(tokenId)}
      alt={`Wizard #${tokenId}`}
      fill
      className="object-cover"
      unoptimized
    />
  );
};
