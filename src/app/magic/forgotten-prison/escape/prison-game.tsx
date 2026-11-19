"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { EscapeCharacter } from "@/lib/forgotten-prison/escape";
import type { PrisonGameBridge } from "./prison-scene";

const PrisonGame = ({
  character,
  release,
  onArrive,
  onRevealed,
}: {
  character: EscapeCharacter;
  release: { character: EscapeCharacter; bonus: boolean } | null;
  onArrive: () => void;
  onRevealed: () => void;
}) => {
  const mount = useRef<HTMLDivElement>(null);
  const bridge = useRef<PrisonGameBridge | null>(null);
  const [warning, setWarning] = useState("");
  const [ready, setReady] = useState(false);
  const arrive = useEffectEvent(onArrive);
  const revealed = useEffectEvent(onRevealed);
  useEffect(() => {
    let cancelled = false;
    void import("./prison-scene")
      .then(({ createPrisonGame }) => {
        if (cancelled || !mount.current) return;
        bridge.current = createPrisonGame(mount.current, character, {
          arrive: () => arrive(),
          revealed: () => revealed(),
          warning: setWarning,
        });
        setReady(true);
      })
      .catch(() =>
        setWarning(
          "The scene could not load. You can still talk to Stank and claim below.",
        ),
      );
    return () => {
      cancelled = true;
      bridge.current?.destroy();
      bridge.current = null;
    };
  }, [character]);
  useEffect(() => {
    if (ready && release)
      bridge.current?.release(release.character, release.bonus);
  }, [ready, release]);
  return (
    <div>
      <div
        ref={mount}
        className="aspect-[608/240] w-full overflow-hidden rounded-t-2xl bg-[#141020] [&_canvas]:max-w-full [&_canvas]:outline-violet-300 [&_canvas]:[image-rendering:pixelated]"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-violet-300/15 bg-black/20 px-5 py-3 font-sans text-xs text-violet-200/60">
        <p>Click or tap the path · Arrow keys / A D to walk · E to talk</p>
        <button
          type="button"
          className="text-violet-200 underline underline-offset-4"
          onClick={() => {
            bridge.current?.approach();
            onArrive();
          }}
        >
          Talk to Stank
        </button>
      </div>
      {warning ? (
        <p
          role="status"
          className="border-t border-amber-300/20 p-3 font-sans text-xs text-amber-100"
        >
          {warning}
        </p>
      ) : null}
    </div>
  );
};
export default PrisonGame;
