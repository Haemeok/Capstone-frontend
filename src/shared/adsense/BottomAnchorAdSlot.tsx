"use client";

import { useEffect, useRef, useState } from "react";

import { AdPlaceholder } from "./AdPlaceholder";
import { useAdsGate } from "./AdsGateContext";
import { ADSENSE_CLIENT_ID, AD_SLOT_IDS, IS_AD_TEST_MODE } from "./config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_HEIGHT = 70;

// 모바일 하단(=BottomNavBar 자리) 위에 sticky 로 박히는 anchor 광고. 데스크톱에선
// sticky 하단 바가 의미 없어 md:hidden 으로 가린다. 이전엔 흰 바 collapse 문제로
// 통째로 비활성화돼 있었으나 AdsGateProvider 게이트가 들어오면서 복구.
export const BottomAnchorAdSlot = () => {
  const { enabled } = useAdsGate();
  const [hydrated, setHydrated] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !enabled) return;
    const ins = insRef.current;
    if (!ins) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adblock / network failure — silent
    }
  }, [hydrated, enabled]);

  if (!hydrated) return null;
  if (!enabled) return null;

  const slotId = AD_SLOT_IDS.recipeBottomAnchor || undefined;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-dropdown md:hidden overflow-hidden border-t border-gray-200 bg-white"
      style={{ height: AD_HEIGHT }}
    >
      {!slotId ? (
        IS_AD_TEST_MODE ? (
          <AdPlaceholder minHeight={AD_HEIGHT} className="h-full w-full" />
        ) : null
      ) : (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: AD_HEIGHT }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-adtest={IS_AD_TEST_MODE ? "on" : undefined}
        />
      )}
    </div>
  );
};
