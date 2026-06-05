"use client";

import { useCountdown } from "@/shared/lib/hooks/useCountdown";

import { useUserStore } from "./store";

export type AdFreeStatus = {
  isActive: boolean;
  remaining: number;
  adFreeUntil: string | null;
};

export const useAdFreeStatus = (): AdFreeStatus => {
  const adFreeUntil =
    useUserStore((s) => s.user?.adStatus?.adFreeUntil) ?? null;
  const showAds = useUserStore((s) => s.user?.adStatus?.showAds);
  const remaining = useCountdown(adFreeUntil);
  const isActive = showAds === false && remaining > 0;

  return { isActive, remaining, adFreeUntil };
};
