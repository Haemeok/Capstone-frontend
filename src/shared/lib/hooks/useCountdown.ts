"use client";

import { useEffect, useState } from "react";

const computeRemaining = (target: string | null | undefined): number => {
  if (!target) return 0;
  return Math.max(0, new Date(target).getTime() - Date.now());
};

export const useCountdown = (target: string | null | undefined): number => {
  const [remaining, setRemaining] = useState(() => computeRemaining(target));

  useEffect(() => {
    if (!target) return;

    const id = setInterval(() => {
      const next = computeRemaining(target);
      setRemaining(next);
      if (next <= 0) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  return remaining;
};
