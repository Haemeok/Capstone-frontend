"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AdsGateContext, type AdsGateValue } from "@/shared/adsense/AdsGateContext";
import { ADSENSE_TEST_USER_ID } from "@/shared/adsense/config";
import { isAdsEnabled } from "@/shared/adsense/lib/isAdsEnabled";

import { useUserStore } from "@/entities/user/model/store";

// AdSense 게이트 계산을 한 곳에 모은다.
// 정책: 웹/앱 웹뷰 모두 env(isAdsEnabled) 통과만 하면 모든 사용자에게 노출.
// isTestUser 는 InArticleAdSlot 의 "모바일 hidden 검수 해제" 분기에서만 사용한다.
//
// fail-closed hydration 가드: SSR / 첫 client commit 에선 enabled=true 로 잘못
// 계산되면 <Script> 가 인젝트되어 adsbygoogle.js 가 로드되고 doubleclick 도메인
// 요청이 발생한다. RN WebView 가 그걸 navigation 으로 잡아 외부 브라우저를 띄우는
// 사고가 있어서, hydrated 플래그로 첫 commit 은 무조건 disabled 로 막고 effect
// 이후에만 진짜 게이트를 평가한다.
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
    const enabled = isAdsEnabled();
    return { enabled, isTestUser };
  }, [hydrated, userId]);

  return (
    <AdsGateContext.Provider value={value}>
      {children}
    </AdsGateContext.Provider>
  );
};
