"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  AdsGateContext,
  type AdsGateValue,
} from "@/shared/adsense/AdsGateContext";
import { ADSENSE_TEST_USER_IDS } from "@/shared/adsense/config";
import { isAdsEnabled } from "@/shared/adsense/lib/isAdsEnabled";

import { useUserStore } from "@/entities/user/model/store";

export const AdsGateProvider = ({ children }: { children: ReactNode }) => {
  const userId = useUserStore((state) => state.user?.id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const value = useMemo<AdsGateValue>(() => {
    if (!hydrated) return { enabled: false, isTestUser: false };

    const isTestUser = Boolean(userId && ADSENSE_TEST_USER_IDS.has(userId));
    const enabled = isAdsEnabled() && !isTestUser;
    return { enabled, isTestUser };
  }, [hydrated, userId]);

  return (
    <AdsGateContext.Provider value={value}>{children}</AdsGateContext.Provider>
  );
};
