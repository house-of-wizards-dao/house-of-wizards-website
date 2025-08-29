import { useState, useEffect } from "react";
import { AuctionTimer } from "@/types";

/**
 * Hook to manage auction countdown timer
 */
export function useAuctionTimer(
  endTime: string,
  startTime?: string,
): AuctionTimer {
  const [timer, setTimer] = useState<AuctionTimer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isActive: false,
    hasEnded: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const start = startTime ? new Date(startTime).getTime() : now;

      // Check if auction hasn't started yet
      if (now < start) {
        setTimer({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isActive: false,
          hasEnded: false,
        });
        return;
      }

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
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, startTime]);

  return timer;
}
