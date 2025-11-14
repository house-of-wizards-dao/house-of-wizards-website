"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Snowfall from "react-snowfall";
import DefaultLayout from "@/layouts/default";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Web3Provider } from "@/components/Web3Provider";
import WizardBrowser from "@/components/WizardBrowser";

export default function PfpMintPage() {
  const [isClient, setIsClient] = useState(false);
  const [snowflakes, setSnowflakes] = useState<HTMLImageElement[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
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
        <Web3Provider>
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-24">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  The Wizard PFP Mint
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
                    <span className="font-semibold text-violet">soulbound</span>{" "}
                    — forever connected to their wizards—and will find their
                    home in the backpack wallet of each respective wizard. Best
                    of all? It's{" "}
                    <span className="font-semibold text-violet">
                      0.0005 ETH
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
                        Total: {(selectedTokens.length * 0.0005).toFixed(4)} ETH
                      </div>
                      <button
                        className="w-full bg-violet hover:bg-violet/80 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg"
                        disabled={selectedTokens.length === 0}
                      >
                        Mint
                      </button>
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
        </Web3Provider>
      </ErrorBoundary>
    </DefaultLayout>
  );
}
