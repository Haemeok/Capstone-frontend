"use client";

import { useEffect, useRef, useState } from "react";

import { calculateFakeProgress } from "./progress";

const SMOOTH_INCREMENT_INTERVAL_MS = 2000;
const MAX_SMOOTH_PROGRESS = 95;

const getIncrement = (currentProgress: number): number => {
  if (currentProgress < 10) return 3;
  if (currentProgress < 30) return 2;
  if (currentProgress < 60) return 1;
  return 0.5;
};

export type SmoothProgressStatus = "pending" | "success" | "error";

export const useSmoothProgress = (
  realProgress: number,
  status: SmoothProgressStatus,
  startTime: number
) => {
  const [displayed, setDisplayed] = useState(() =>
    Math.max(realProgress, calculateFakeProgress(startTime))
  );
  const realRef = useRef(realProgress);

  useEffect(() => {
    realRef.current = realProgress;
  }, [realProgress]);

  useEffect(() => {
    if (status !== "pending") return;

    const interval = setInterval(() => {
      setDisplayed((prev) => {
        const base = Math.max(prev, realRef.current);
        return Math.min(
          Math.round(base + getIncrement(base)),
          MAX_SMOOTH_PROGRESS
        );
      });
    }, SMOOTH_INCREMENT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [status]);

  return status === "success" ? 100 : displayed;
};
