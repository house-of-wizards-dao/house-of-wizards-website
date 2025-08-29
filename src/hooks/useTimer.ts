import { useState, useEffect } from "react";
import type { AuctionTimer } from "@/types";

export function useTimer(endTime: string): AuctionTimer {
  const [timer, setTimer] = useState<AuctionTimer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isActive: false,
    hasEnded: false,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimer({
          days,
          hours,
          minutes,
          seconds,
          isActive: true,
          hasEnded: false,
        });
      } else {
        setTimer({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isActive: false,
          hasEnded: true,
        });
      }
    };

    // Update immediately
    updateTimer();

    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timer;
}
