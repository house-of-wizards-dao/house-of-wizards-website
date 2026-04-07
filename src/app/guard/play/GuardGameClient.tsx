"use client";

import { useEffect, useRef, useState } from "react";

type GuardGameModule = {
  mountGuardGame: (container: HTMLElement) => {
    destroy: () => void;
  };
};

const GUARD_GAME_STYLESHEET_ID = "guard-game-stylesheet";

const ensureGuardStylesheet = () => {
  if (document.getElementById(GUARD_GAME_STYLESHEET_ID)) {
    return;
  }

  const link = document.createElement("link");
  link.id = GUARD_GAME_STYLESHEET_ID;
  link.rel = "stylesheet";
  link.href = "/guard-game/guard-game.css";
  document.head.append(link);
};

export function GuardGameClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading_module" | "module_loaded" | "mounted"
  >("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    const mount = async () => {
      try {
        setStatus("loading_module");
        ensureGuardStylesheet();
        const moduleUrl = new URL(
          "/guard-game/guard-game.js",
          window.location.origin,
        ).href;
        const { mountGuardGame } = (await import(
          /* webpackIgnore: true */ moduleUrl
        )) as GuardGameModule;
        if (cancelled) return;
        setStatus("module_loaded");
        const mounted = mountGuardGame(el);
        destroy = mounted.destroy;
        setStatus("mounted");
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to initialize game.";
        setError(message);
      }
    };

    void mount();

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  if (error) {
    return (
      <div className="rounded border border-rose-500/40 bg-rose-950/30 p-4 text-rose-200">
        Failed to load game: {error}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {status !== "mounted" && (
        <div className="rounded border border-violet-500/35 bg-violet-950/35 px-3 py-2 text-xs text-[#d8c8ff]">
          Loading game:{" "}
          {status === "idle"
            ? "idle"
            : status === "loading_module"
              ? "loading module"
              : "initializing Phaser"}
        </div>
      )}
      <div
        ref={ref}
        className="guard-phaser-embed border border-violet-500/25"
        style={{ width: "100%", minHeight: "min(720px, 85dvh)" }}
      />
    </div>
  );
}
