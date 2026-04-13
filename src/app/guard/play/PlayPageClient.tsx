"use client";

import { GuardGameClient } from "./GuardGameClient";

export function PlayPageClient() {
  return (
    <div className="w-full bg-gradient-to-b from-[#080510] via-[#140a24] to-[#05030b] text-[#e7ddff]">
      <div className="w-full px-2 pb-8 pt-4 sm:px-4">
        <GuardGameClient />
      </div>
    </div>
  );
}
