"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/utils";
import { ButtonVariant } from "./types";

type ProgressBarProps = {
  isPaused: boolean;
  interval?: number;
  variant?: ButtonVariant;
  onComplete?: () => void;
};

const DEFAULT_INTERVAL_MS = 5000;

export const ProgressBar = ({
  isPaused,
  interval = DEFAULT_INTERVAL_MS,
  variant = "white",
  onComplete,
}: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    elapsedRef.current = 0;

    if (progressRef.current) {
      progressRef.current.style.width = "0%";
    }
  }, [interval]);

  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      elapsedRef.current = Date.now() - startTimeRef.current;
      return;
    }

    startTimeRef.current = Date.now() - elapsedRef.current;

    const animate = () => {
      const currentElapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((currentElapsed / interval) * 100, 100);

      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }

      if (progress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, interval]);

  return (
    <div className="h-0.5 flex-1 translate-z-0 overflow-hidden rounded-full bg-white/30">
      <div
        ref={progressRef}
        className={cn(
          "h-full transition-none will-change-[width]",
          variant === "white" ? "bg-white" : "bg-black"
        )}
        style={{ width: "0%" }}
      />
    </div>
  );
};
