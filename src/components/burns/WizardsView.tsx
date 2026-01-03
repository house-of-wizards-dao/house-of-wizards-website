"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getWizardName, getWizards } from "@/lib/wizards";
import { TraitFilter, type TraitType } from "@/components/burns/TraitFilter";
import Image from "next/image";
import type { StatsData } from "@/lib/burn-stats";

interface BurnsListProps {
  order: string[];
  souls: StatsData["souls"];
}

function BurnsList({ order, souls }: BurnsListProps) {
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
            <span className="w-12 h-4 m-2 max-w-24 font-atirose text-brand-500 text-3xl">→</span>
            <div>
              <Link
                href={`https://opensea.io/item/ethereum/0x251b5f14a825c537ff788604ea1b58e49b70726f/${token}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={`https://portal.forgottenrunes.com/api/souls/img/${token}`}
                  alt={souls[token]?.name || ""}
                  width={150}
                  height={150}
                />
              </Link>
              <h3 className="text-sm max-w-52">{souls[token]?.name || ""}</h3>
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
  const [filteredOrder, setFilteredOrder] = useState<string[]>([]);

  // Initialize filteredOrder when data loads
  useEffect(() => {
    if (data) {
      setFilteredOrder(data.order);
    }
  }, [data]);

  // Build traits map for all wizards
  const wizardTraitsMap = useMemo(() => {
    const wizards = getWizards();
    const map: Record<string, Record<TraitType, string | undefined>> = {};
    
    data.order.forEach((id) => {
      const wizard = wizards[id];
      if (wizard) {
        map[id] = {
          head: wizard.head,
          body: wizard.body,
          prop: wizard.prop,
          familiar: wizard.familiar,
          rune: wizard.rune,
          background: wizard.background,
        };
      }
    });
    
    return map;
  }, [data.order]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TraitFilter
        traits={data.traits}
        itemIds={data.order}
        traitsMap={wizardTraitsMap}
        onFilterChange={setFilteredOrder}
        itemLabel="wizards"
      />
      <BurnsList order={filteredOrder} souls={data.souls} />
    </div>
  );
}

