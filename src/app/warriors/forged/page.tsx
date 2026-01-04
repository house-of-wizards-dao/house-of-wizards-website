"use client";

import { useState, useEffect } from "react";
import { useForgedWarriors } from "@/hooks/useForgedWarriors";
import { ForgedWarriorsListView } from "@/components/warriors/ForgedWarriorsListView";
import { ForgedWithFilter } from "@/components/warriors/ForgedWithFilter";
import { PageTitle } from "@/components/PageTitle";
import Image from "next/image";
import type { WarriorGraphQLResponse } from "@/lib/frwc-graphql";

export default function WarriorsPage() {
  const { data: warriors, loading, error } = useForgedWarriors();
  const [filteredWarriors, setFilteredWarriors] = useState<
    WarriorGraphQLResponse[]
  >([]);

  const pageTitle = "Forged Warriors";
  const pageDescription = `${warriors.length} warrior${warriors.length !== 1 ? "s" : ""} with forged weapons`;

  // Initialize filteredWarriors when warriors data loads
  useEffect(() => {
    if (warriors && warriors.length > 0) {
      setFilteredWarriors(warriors);
    }
  }, [warriors]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-8xl">
        <PageTitle title={pageTitle} />
        <Image src="/img/tulip.gif" alt="Loading" width={200} height={200} />
      </div>
    );
  }

  if (error || !warriors) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <PageTitle title={pageTitle} />
        <p className="text-gray-400">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <PageTitle title={pageTitle} />
      <p className="text-gray-400 text-center max-w-2xl px-4">
        {pageDescription}
      </p>
      <ForgedWithFilter
        warriors={warriors}
        onFilterChange={setFilteredWarriors}
      />
      <ForgedWarriorsListView
        warriors={filteredWarriors.length > 0 ? filteredWarriors : warriors}
      />
    </div>
  );
}
