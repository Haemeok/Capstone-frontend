"use client";

import { createContext, useContext } from "react";

// 광고 노출 게이트.
// - enabled: 광고 스크립트/슬롯 마운트 여부. env 통과 && 매칭된 blocklist 유저가
//   아닐 때만 true.
// - isTestUser: ADSENSE_TEST_USER_ID 가 설정돼 있고 그 값이 현재 user.id 와
//   일치할 때 true. 이 유저는 enabled 가 false 로 떨어져 광고가 막힌다.
// shared 레이어가 entities(user store)에 직접 의존하지 않도록 Context만 두고
// 실제 계산은 app 레이어의 AdsGateProvider가 담당한다.
export type AdsGateValue = {
  enabled: boolean;
  isTestUser: boolean;
};

const DEFAULT_VALUE: AdsGateValue = { enabled: false, isTestUser: false };

export const AdsGateContext = createContext<AdsGateValue>(DEFAULT_VALUE);

export const useAdsGate = (): AdsGateValue => useContext(AdsGateContext);
