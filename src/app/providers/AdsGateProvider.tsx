"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AdsGateContext, type AdsGateValue } from "@/shared/adsense/AdsGateContext";
import { ADSENSE_TEST_USER_ID } from "@/shared/adsense/config";
import { isAdsEnabled } from "@/shared/adsense/lib/isAdsEnabled";
import { isAppWebView } from "@/shared/lib/bridge";

import { useUserStore } from "@/entities/user/model/store";

// AdSense 게이트 계산을 한 곳에 모은다.
// 정책:
// - 웹: env(isAdsEnabled) 통과만 하면 모든 사용자에게 노출.
// - 앱 웹뷰: ADSENSE_TEST_USER_ID 가 설정돼 있으면 그 값과 user.id 가 일치할
//   때만 노출. 설정이 비어 있으면 게이트 비활성 — 앱 사용자 모두에게 노출.
//   앱 측 광고 코드 배포가 끝나면 env 만 비워서 게이트를 해제한다.
// - isTestUser: 본인 검수 시 모바일 hidden 같은 추가 게이트를 풀기 위한 플래그.
//
// fail-closed hydration 가드: SSR / 첫 client commit 에선 isApp/userId 가
// 아직 정확한 값이 아니므로 (isApp=false 초기값, store hydration 전), 그 윈도우
// 동안 enabled=true 로 잘못 계산되면 <Script> 가 인젝트되어 adsbygoogle.js 가
// 로드되고 doubleclick 도메인 요청이 발생한다. RN WebView 가 그걸 navigation
// 으로 잡아 외부 브라우저를 띄우는 사고가 있어서, hydrated 플래그로 첫 commit
// 은 무조건 disabled 로 막고 effect 이후에만 진짜 게이트를 평가한다.
export const AdsGateProvider = ({ children }: { children: ReactNode }) => {
  const userId = useUserStore((state) => state.user?.id);
  const [hydrated, setHydrated] = useState(false);
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(isAppWebView());
    setHydrated(true);
  }, []);

  const value = useMemo<AdsGateValue>(() => {
    if (!hydrated) return { enabled: false, isTestUser: false };

    const isTestUser = Boolean(
      ADSENSE_TEST_USER_ID && userId === ADSENSE_TEST_USER_ID,
    );
    const passesAppGate = !isApp || !ADSENSE_TEST_USER_ID || isTestUser;
    const enabled = isAdsEnabled() && passesAppGate;
    return { enabled, isTestUser };
  }, [hydrated, isApp, userId]);

  return (
    <AdsGateContext.Provider value={value}>
      {children}
    </AdsGateContext.Provider>
  );
};
