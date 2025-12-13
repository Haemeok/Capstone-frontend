import { useCallback, useEffect, useRef, useState } from "react";

type UseCarouselAutoplayProps = {
  onNext: () => void;
  interval?: number;
  isEnabled?: boolean;
};

export const useCarouselAutoplay = ({
  onNext,
  interval = 5000,
  isEnabled = true,
}: UseCarouselAutoplayProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (isEnabled && !isPaused) {
      timerRef.current = setInterval(() => {
        onNext();
      }, interval);
    }
  }, [isEnabled, isPaused, interval, onNext, clearTimer]);

  const pause = useCallback(() => {
    setIsPaused(true);
    clearTimer();
  }, [clearTimer]);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    startTimer();
  }, [clearTimer, startTimer]);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  return {
    isPaused,
    pause,
    resume,
    reset,
  };
};
