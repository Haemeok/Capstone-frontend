"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AdsGateContext, type AdsGateValue } from "@/shared/adsense/AdsGateContext";
import { ADSENSE_TEST_USER_ID } from "@/shared/adsense/config";
import { isAdsEnabled } from "@/shared/adsense/lib/isAdsEnabled";

import { useUserStore } from "@/entities/user/model/store";

// AdSense 게이트 계산을 한 곳에 모은다.
// 정책: env(isAdsEnabled) 통과 && 현재 user.id !== ADSENSE_TEST_USER_ID 일 때만
// 노출. 매칭된 유저는 script 로드와 모든 슬롯 렌더가 통째로 막힌다.
//
// fail-closed hydration 가드: SSR / 첫 client commit 은 무조건 disabled 로 두고
// effect 이후에 진짜 게이트를 평가한다. 첫 commit 에서 잘못 enabled=true 면
// adsbygoogle.js 가 로드되며 doubleclick 요청이 발생하고, RN WebView 가 그걸
// navigation 으로 잡아 외부 브라우저를 띄운 사고 이력 때문.
export const AdsGateProvider = ({ children }: { children: ReactNode }) => {
  const userId = useUserStore((state) => state.user?.id);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const value = useMemo<AdsGateValue>(() => {
    if (!hydrated) return { enabled: false, isTestUser: false };

    const isTestUser = Boolean(
      ADSENSE_TEST_USER_ID && userId === ADSENSE_TEST_USER_ID,
    );
    const enabled = isAdsEnabled() && !isTestUser;
    return { enabled, isTestUser };
  }, [hydrated, userId]);

  return (
    <AdsGateContext.Provider value={value}>
      {children}
    </AdsGateContext.Provider>
  );
};
