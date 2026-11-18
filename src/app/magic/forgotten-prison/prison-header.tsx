"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./prison-header.module.css";

export const PrisonHeader = ({ local }: { local: boolean }) => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;

    const update = () => {
      frame = 0;
      const bounds = header.getBoundingClientRect();
      const distance = reducedMotion.matches
        ? 0
        : Math.min(Math.max(-bounds.top, 0), bounds.height);
      header.style.setProperty("--prison-scroll", `${distance}px`);
    };
    const schedule = () => {
      if (visible && !reducedMotion.matches && !frame)
        frame = window.requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(header);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", update);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.artwork}>
        <Image
          src="/img/forgotten-prison/dread-tower.webp"
          alt="The Dread Tower beneath a crowned skull, with prisoners trapped inside."
          fill
          sizes="(min-width: 768px) 65vw, 100vw"
          preload
          className={styles.image}
        />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.copy}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-violet-300 sm:text-xs">
            House of Wizards / Magic
          </p>
          <h1 className={styles.title}>
            Forgotten
            <br />
            <span className="text-violet-300">Prison</span>
          </h1>
          <p className="max-w-md font-sans text-base leading-relaxed text-violet-100/80 sm:text-lg">
            One winning bid. One prisoner freed.
            <br />
            Bid for a warrior or wizard, with a chance to take home an Imp Box
            too.
          </p>
          {local ? (
            <p className="inline-flex rounded-full border border-amber-300/25 bg-amber-200/5 px-3 py-1 font-sans text-xs text-amber-200">
              Local preview · test ETH and NFTs
            </p>
          ) : null}
          <a href="#prison-auction" className={styles.enter}>
            Enter the prison <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </header>
  );
};
