"use client";

import { createContext, useContext } from "react";

// 광고 노출 게이트.
// - enabled: 광고 마운트 여부. 웹은 env 통과만 하면 true, 앱 웹뷰는 추가로
//   테스트 userId env 가 비었거나 user.id 와 일치할 때만 true.
// - isTestUser: ADSENSE_TEST_USER_ID 가 설정돼 있고 그 값이 현재 user.id 와
//   일치할 때 true. 모바일 hidden 처리 같이 "본인 검수 시에는 풀어야 하는"
//   분기에서 사용한다.
// shared 레이어가 entities(user store)에 직접 의존하지 않도록 Context만 두고
// 실제 계산은 app 레이어의 AdsGateProvider가 담당한다.
export type AdsGateValue = {
  enabled: boolean;
  isTestUser: boolean;
};

const DEFAULT_VALUE: AdsGateValue = { enabled: false, isTestUser: false };

export const AdsGateContext = createContext<AdsGateValue>(DEFAULT_VALUE);

export const useAdsGate = (): AdsGateValue => useContext(AdsGateContext);
