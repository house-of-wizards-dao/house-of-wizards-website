"use client";

import dynamic from "next/dynamic";
import type { PrisonTarget } from "@/lib/forgotten-prison/bidding";

const EscapeClient = dynamic(() => import("./escape-client"), {
  ssr: false,
  loading: () => (
    <p role="status" className="py-16 text-center font-sans text-violet-200/60">
      Lighting the torches…
    </p>
  ),
});
export const EscapeEntry = ({
  target,
  drawId,
}: {
  target: PrisonTarget | null;
  drawId?: string;
}) => <EscapeClient target={target} drawId={drawId} />;
