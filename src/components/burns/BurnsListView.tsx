"use client";

import React from "react";
import Link from "next/link";
import type { Burn } from "@/lib/burn-stats";
import { LazyImage } from "../ui/LazyImage";

interface BurnsListViewProps {
  burns: Burn[];
  primaryType: "wizard" | "soul";
}

export function BurnsListView({ burns, primaryType }: BurnsListViewProps) {
  const isWizardFirst = primaryType === "wizard";

  // OpenSea contract addresses
  const WIZARD_CONTRACT = "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42";
  const SOUL_CONTRACT = "0x251b5f14a825c537ff788604ea1b58e49b70726f";

  // Image URLs
  const WIZARD_IMAGE_URL = (tokenId: string) =>
    `https://nftz.forgottenrunes.com/wizards/${tokenId}.png`;
  const SOUL_IMAGE_URL = (tokenId: string) =>
    `https://portal.forgottenrunes.com/api/souls/img/${tokenId}`;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-1">
      {burns.map((burn, index) => {
        const primary = isWizardFirst ? burn.wizard : burn.soul;
        const secondary = isWizardFirst ? burn.soul : burn.wizard;
        const primaryContract = isWizardFirst ? WIZARD_CONTRACT : SOUL_CONTRACT;
        const secondaryContract = isWizardFirst
          ? SOUL_CONTRACT
          : WIZARD_CONTRACT;
        const primaryImageUrl = isWizardFirst
          ? WIZARD_IMAGE_URL(burn.tokenId)
          : SOUL_IMAGE_URL(burn.tokenId);
        const secondaryImageUrl = isWizardFirst
          ? SOUL_IMAGE_URL(burn.tokenId)
          : WIZARD_IMAGE_URL(burn.tokenId);
        const arrow = isWizardFirst ? "→" : "←";

        return (
          <div
            className={`flex flex-row items-start justify-center w-full max-w-2xl mx-2 sm:mx-4 px-3 sm:px-6 py-2 gap-2 sm:gap-4 ${index % 2 === 0 ? "border border-gray-800 rounded-lg" : ""}`}
            key={burn.tokenId}
          >
            <h2 className="font-atirose text-brand-500 text-sm sm:text-lg md:text-xl lg:text-2xl flex-shrink-0 self-center">
              {burn.burnIndex + 1}.
            </h2>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <Link
                href={`https://opensea.io/item/ethereum/${primaryContract}/${burn.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-[150px] aspect-square flex-shrink-0"
              >
                <LazyImage
                  alt={primary.name}
                  src={primaryImageUrl}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
              </Link>
              <h3 className="text-[10px] sm:text-xs md:text-sm mt-1 text-center w-full max-w-[150px]">
                {primary.name}
              </h3>
            </div>
            <span className="font-atirose text-brand-500 text-base sm:text-xl md:text-2xl lg:text-3xl flex-shrink-0 px-1 sm:px-2 self-center">
              {arrow}
            </span>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <Link
                href={`https://opensea.io/item/ethereum/${secondaryContract}/${burn.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-[150px] aspect-square flex-shrink-0"
              >
                <LazyImage
                  alt={secondary.name}
                  src={secondaryImageUrl}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full"
                />
              </Link>
              <h3 className="text-[10px] sm:text-xs md:text-sm mt-1 text-center w-full max-w-[150px]">
                {secondary.name}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
