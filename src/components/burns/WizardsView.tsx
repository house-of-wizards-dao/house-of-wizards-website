"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { TraitFilter } from "@/components/burns/TraitFilter";
import Image from "next/image";
import type { StatsData, Burn } from "@/lib/burn-stats";
import { TRAITS } from "@/lib/traits";

interface BurnsListProps {
  burns: Burn[];
}

function BurnsList({ burns }: BurnsListProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      {burns.map((burn, index) => {
        return (
          <div className={`flex flex-row items-center justify-center p-6 ${index % 2 === 0 ? "border border-gray-800 rounded-lg" : ""}`} key={burn.tokenId}>
            <h2 className="font-atirose text-brand-500 text-2xl">
              {burns.length - index}.
            </h2>
            <div className="self-start">
              <Link
                href={`https://opensea.io/item/ethereum/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/${burn.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://nftz.forgottenrunes.com/wizards/${burn.tokenId}.png`}
                  alt={burn.wizard.name}
                  width={150}
                  height={150}
                />
              </Link>
              <h3 className="text-sm max-w-52">{burn.wizard.name}</h3>
            </div>
            <span className="w-12 h-4 m-2 max-w-24 font-atirose text-brand-500 text-3xl">→</span>
            <div>
              <Link
                href={`https://opensea.io/item/ethereum/0x251b5f14a825c537ff788604ea1b58e49b70726f/${burn.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://portal.forgottenrunes.com/api/souls/img/${burn.tokenId}`}
                  alt={burn.soul.name}
                  width={150}
                  height={150}
                />
              </Link>
              <h3 className="text-sm max-w-52">{burn.soul.name}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface WizardsViewProps {
  data: StatsData;
}

export function WizardsView({ data }: WizardsViewProps) {
  const [filteredBurns, setFilteredBurns] = useState<Burn[]>([]);

  // Initialize filteredBurns when data loads
  useEffect(() => {
    if (data) {
      setFilteredBurns(data.burns);
    }
  }, [data]);

  // Build trait stats from wizards for the filter
  const wizardTraitStats = useMemo(() => {
    const traitMap = new Map<string, { type: string; name: string }>();
    
    data.burns.forEach((burn) => {
      const wizard = burn.wizard;
      TRAITS.forEach((traitType) => {
        const value = wizard[traitType];
        if (value) {
          const mapKey = `${traitType}_${value}`;
          if (!traitMap.has(mapKey)) {
            traitMap.set(mapKey, { type: traitType, name: value });
          }
        }
      });
    });
    
    return Array.from(traitMap.values());
  }, [data.burns]);

  const handleFilterChange = useCallback((filtered: Array<{ tokenId: string }>) => {
    const tokenIdSet = new Set(filtered.map(f => f.tokenId));
    setFilteredBurns(data.burns.filter(burn => tokenIdSet.has(burn.tokenId)));
  }, [data.burns]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TraitFilter
        traits={wizardTraitStats}
        burns={data.burns}
        filterBy="wizard"
        onFilterChange={handleFilterChange}
        itemLabel="wizards"
      />
      <BurnsList burns={filteredBurns} />
    </div>
  );
}

