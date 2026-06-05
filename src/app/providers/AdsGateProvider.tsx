"use client";

import { type ReactNode, useMemo } from "react";

import {
  AdsGateContext,
  type AdsGateValue,
} from "@/shared/adsense/AdsGateContext";
import { ADSENSE_TEST_USER_IDS } from "@/shared/adsense/config";
import { isAdsEnabled } from "@/shared/adsense/lib/isAdsEnabled";
import { resolveAdsEnabled } from "@/shared/adsense/lib/resolveAdsEnabled";
import { useIsHydrated } from "@/shared/hooks/useIsHydrated";

import { useUserStore } from "@/entities/user/model/store";

export const AdsGateProvider = ({ children }: { children: ReactNode }) => {
  const userId = useUserStore((state) => state.user?.id);
  const showAds = useUserStore((state) => state.user?.adStatus?.showAds);
  const hydrated = useIsHydrated();

  const value = useMemo<AdsGateValue>(() => {
    if (!hydrated) return { enabled: false, isTestUser: false };

    const isTestUser = Boolean(userId && ADSENSE_TEST_USER_IDS.has(userId));
    const enabled = resolveAdsEnabled({
      adsEnabled: isAdsEnabled(),
      isTestUser,
      showAds,
    });
    return { enabled, isTestUser };
  }, [hydrated, userId, showAds]);

  return (
    <AdsGateContext.Provider value={value}>{children}</AdsGateContext.Provider>
  );
};
