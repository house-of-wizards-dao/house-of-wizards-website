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
  const WIZARD_IMAGE_URL = (tokenId: string) => `https://nftz.forgottenrunes.com/wizards/${tokenId}.png`;
  const SOUL_IMAGE_URL = (tokenId: string) => `https://portal.forgottenrunes.com/api/souls/img/${tokenId}`;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-1">
      {burns.map((burn, index) => {
        const primary = isWizardFirst ? burn.wizard : burn.soul;
        const secondary = isWizardFirst ? burn.soul : burn.wizard;
        const primaryContract = isWizardFirst ? WIZARD_CONTRACT : SOUL_CONTRACT;
        const secondaryContract = isWizardFirst ? SOUL_CONTRACT : WIZARD_CONTRACT;
        const primaryImageUrl = isWizardFirst ? WIZARD_IMAGE_URL(burn.tokenId) : SOUL_IMAGE_URL(burn.tokenId);
        const secondaryImageUrl = isWizardFirst ? SOUL_IMAGE_URL(burn.tokenId) : WIZARD_IMAGE_URL(burn.tokenId);
        const arrow = isWizardFirst ? "→" : "←";

        return (
          <div 
            className={`flex flex-row items-center justify-center px-6 py-2 ${index % 2 === 0 ? "border border-gray-800 rounded-lg" : ""}`} 
            key={burn.tokenId}
          >
            <h2 className="font-atirose text-brand-500 text-2xl">
              {burn.burnIndex}.
            </h2>
            <div className="self-start">
              <Link
                href={`https://opensea.io/item/ethereum/${primaryContract}/${burn.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyImage
                  alt={primary.name}
                  src={primaryImageUrl}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </Link>
              <h3 className="text-sm max-w-52">{primary.name}</h3>
            </div>
            <span className="w-12 h-4 m-2 max-w-24 font-atirose text-brand-500 text-3xl">{arrow}</span>
            <div>
              <Link
                href={`https://opensea.io/item/ethereum/${secondaryContract}/${burn.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LazyImage
                  alt={secondary.name}
                  src={secondaryImageUrl}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </Link>
              <h3 className="text-sm max-w-52">{secondary.name}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

