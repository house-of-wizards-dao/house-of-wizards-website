"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { getWizardName } from "@/lib/wizards";
import { TraitFilter } from "@/components/burns/TraitFilter";
import Image from "next/image";
import type { BurnData } from "@/lib/burn-stats";

interface BurnsListProps {
  order: string[];
  souls: { [tokenId: string]: { name: string } };
}

function BurnsList({ order, souls }: BurnsListProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {order.map((token, index) => {
        return (
          <div className="flex flex-row items-center justify-center" key={index}>
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
                  className="w-52 max-w-60"
                  alt={getWizardName(token)}
                  width={208}
                  height={208}
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
                  className="w-52 max-w-60"
                  alt={souls[token]?.name || ""}
                  width={208}
                  height={208}
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
  data: BurnData;
}

export function WizardsView({ data }: WizardsViewProps) {
  const [filteredOrder, setFilteredOrder] = useState<string[]>([]);

  // Initialize filteredOrder when data loads
  useEffect(() => {
    if (data) {
      setFilteredOrder(data.order);
    }
  }, [data]);

  const handleFilterChange = useCallback((filteredIds: string[]) => {
    setFilteredOrder(filteredIds);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <TraitFilter
        traits={data.traits}
        wizardIds={data.order}
        onFilterChange={handleFilterChange}
      />
      <BurnsList order={filteredOrder} souls={data.souls} />
    </div>
  );
}

