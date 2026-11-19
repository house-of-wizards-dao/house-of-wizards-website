"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { EscapeCharacter } from "@/lib/forgotten-prison/escape";
import type { PrisonGameBridge } from "./prison-scene";
import { StankSpeech } from "./stank-speech";

const PrisonGame = ({
  character,
  release,
  onArrive,
  onRevealed,
  dialogue,
}: {
  character: EscapeCharacter;
  release: { character: EscapeCharacter; bonus: boolean } | null;
  onArrive: () => void;
  onRevealed: () => void;
  dialogue?: string | null;
}) => {
  const mount = useRef<HTMLDivElement>(null);
  const bridge = useRef<PrisonGameBridge | null>(null);
  const [warning, setWarning] = useState("");
  const [ready, setReady] = useState(false);
  const [nearGuard, setNearGuard] = useState(false);
  const arrive = useEffectEvent(onArrive);
  const revealed = useEffectEvent(onRevealed);
  useEffect(() => {
    let cancelled = false;
    void import("./prison-scene")
      .then(({ createPrisonGame }) => {
        if (cancelled || !mount.current) return;
        bridge.current = createPrisonGame(mount.current, character, {
          arrive: () => arrive(),
          proximity: setNearGuard,
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
    if (ready && release) {
      mount.current?.scrollIntoView({ block: "center" });
      bridge.current?.release(release.character, release.bonus);
    }
  }, [ready, release]);
  return (
    <div>
      <div className="relative">
        {dialogue ? (
          <div className="relative z-10 px-3 pb-5 pt-4 md:absolute md:bottom-[42%] md:left-[22%] md:w-[66%] md:p-0">
            <StankSpeech message={dialogue} />
          </div>
        ) : null}
        <div
          ref={mount}
          className="aspect-[608/240] w-full overflow-hidden rounded-t-2xl bg-[#141020] [&_canvas]:max-w-full [&_canvas]:outline-violet-300 [&_canvas]:[image-rendering:pixelated]"
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-violet-300/15 bg-black/20 px-5 py-3 font-sans text-xs text-violet-200/60">
        <div>
          <p>Arrow keys / A D to walk · Or click / tap the path</p>
          <p role="status" className="mt-1 text-violet-100">
            {nearGuard
              ? "Press E to talk to Stank."
              : "Walk up to Stank to talk to him."}
          </p>
        </div>
        <button
          type="button"
          className="text-violet-200 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!nearGuard && !warning}
          onClick={() => {
            if (warning) onArrive();
            else bridge.current?.talk();
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
