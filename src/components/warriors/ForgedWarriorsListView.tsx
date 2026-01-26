"use client";

import React from "react";
import Link from "next/link";
import type { WarriorGraphQLResponse } from "@/lib/frwc-graphql";
import { LazyImage } from "../ui/LazyImage";
import { addresses } from "@/config/addresses";

type ForgedWarriorsListViewProps = {
  warriors: WarriorGraphQLResponse[];
};

export const ForgedWarriorsListView = ({
  warriors,
}: ForgedWarriorsListViewProps) => {
  // Warrior contract address
  const WARRIOR_CONTRACT = addresses.warriors;

  // Image URL pattern for warriors (update if needed)
  const WARRIOR_IMAGE_URL = (tokenId: string) =>
    `https://portal.forgottenrunes.com/api/warriors/img/${tokenId}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {warriors.map((warrior, index) => {
          const tokenId = warrior.token?.tokenId ?? "";

          return (
            <div
              className="flex flex-col items-center gap-2 p-3 border border-gray-800 rounded-lg hover:border-brand-500 transition-colors"
              key={tokenId || index}
            >
              <div className="flex items-center gap-2 w-full">
                <h2 className="font-atirose text-brand-500 text-sm sm:text-base md:text-lg flex-shrink-0">
                  {warriors.length - index}.
                </h2>
              </div>
              <Link
                href={`https://opensea.io/item/ethereum/${WARRIOR_CONTRACT}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full aspect-square flex items-center justify-center"
              >
                <LazyImage
                  alt={warrior.name}
                  src={WARRIOR_IMAGE_URL(tokenId)}
                  width={200}
                  height={200}
                  className="object-contain w-full h-full rounded"
                />
              </Link>
              <h3 className="text-xs sm:text-sm mt-1 text-center w-full break-words">
                {warrior.name}
              </h3>
              <p className="text-[10px] sm:text-xs mt-1 text-center text-brand-500 w-full break-words">
                Forged with: {warrior.forgedWith}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
