"use client";

import { useEffect, useRef } from "react";
import styles from "./stank-speech.module.css";

export const StankSpeech = ({ message }: { message: string }) => {
  const text = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    text.current?.focus({ preventScroll: true });
    text.current?.scrollIntoView({ block: "nearest" });
  }, []);
  return (
    <div className={styles.bubble}>
      <span className={styles.speaker}>Stank Death · Goblin guard</span>
      <p ref={text} tabIndex={-1} aria-live="polite" className={styles.message}>
        {message}
      </p>
      <span aria-hidden="true" className={styles.tail} />
    </div>
  );
};
