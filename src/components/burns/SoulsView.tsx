"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getWizardName } from "@/lib/wizards";
import { TraitFilter, type TraitType } from "@/components/burns/TraitFilter";
import Image from "next/image";
import type { StatsData } from "@/lib/burn-stats";

interface SoulsListProps {
  order: string[];
  data: StatsData;
}

function SoulsList({ order, data }: SoulsListProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      {order.map((token, index) => {
        return (
          <div className={`flex flex-row items-center justify-center p-6 ${index % 2 === 0 ? "border border-gray-800 rounded-lg" : ""}`} key={index}>
            <h2 className="font-atirose text-brand-500 text-2xl">
              {order.length - index}.
            </h2>
            <div className="self-start">
              <Link
                href={`https://opensea.io/item/ethereum/0x251b5f14a825c537ff788604ea1b58e49b70726f/${token}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://portal.forgottenrunes.com/api/souls/img/${token}`}
                  alt={data.souls[token]?.name || ""}
                  width={150}
                  height={150}
                />
              </Link>
              <h3 className="text-sm max-w-52">{data.souls[token]?.name || ""}</h3>
            </div>
            <span className="w-12 h-4 m-2 max-w-24 font-atirose text-brand-500 text-3xl">←</span>
            <div>
              <Link
                href={`https://opensea.io/item/ethereum/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/${token}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://nftz.forgottenrunes.com/wizards/${token}.png`}
                  alt={getWizardName(token)}
                  width={150}
                  height={150}
                />
              </Link>
              <h3 className="text-sm max-w-52">{getWizardName(token)}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface SoulsViewProps {
  data: StatsData;
}

export function SoulsView({ data }: SoulsViewProps) {
  const [filteredOrder, setFilteredOrder] = useState<string[]>([]);

  // Initialize filteredOrder when data loads
  useEffect(() => {
    if (data) {
      setFilteredOrder(data.order);
    }
  }, [data]);

  // Build trait stats from souls for the filter
  const soulTraitStats = useMemo(() => {
    const traitMap = new Map<string, { type: string; name: string }>();
    
    data.order.forEach((soulId) => {
      const soul = data.souls[soulId];
      if (soul?.traits) {
        Object.entries(soul.traits).forEach(([key, value]) => {
          const traitType = key.toLowerCase();
          if (["head", "body", "prop", "familiar", "rune", "background"].includes(traitType) && value) {
            const mapKey = `${traitType}_${value}`;
            if (!traitMap.has(mapKey)) {
              traitMap.set(mapKey, { type: traitType, name: String(value) });
            }
          }
        });
      }
    });
    
    return Array.from(traitMap.values());
  }, [data]);

  // Build traits map for all souls
  const soulTraitsMap = useMemo(() => {
    const map: Record<string, Record<TraitType, string | undefined>> = {};
    
    data.order.forEach((id) => {
      const soul = data.souls[id];
      if (soul?.traits) {
        const traits: Record<TraitType, string | undefined> = {
          head: undefined,
          body: undefined,
          prop: undefined,
          familiar: undefined,
          rune: undefined,
          background: undefined,
        };
        
        // Map soul traits (case-insensitive)
        Object.entries(soul.traits).forEach(([key, value]) => {
          const lowerKey = key.toLowerCase() as TraitType;
          if (["head", "body", "prop", "familiar", "rune", "background"].includes(lowerKey)) {
            traits[lowerKey] = String(value);
          }
        });
        
        map[id] = traits;
      }
    });
    
    return map;
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TraitFilter
        traits={soulTraitStats}
        itemIds={data.order}
        traitsMap={soulTraitsMap}
        onFilterChange={setFilteredOrder}
        itemLabel="souls"
      />
      <SoulsList order={filteredOrder} data={data} />
    </div>
  );
}

