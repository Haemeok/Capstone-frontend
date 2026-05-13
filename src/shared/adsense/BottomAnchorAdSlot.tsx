"use client";

import { useEffect, useRef, useState } from "react";

import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

import { AdPlaceholder } from "./AdPlaceholder";
import { useAdsGate } from "./AdsGateContext";
import { AD_SLOT_IDS, ADSENSE_CLIENT_ID, IS_AD_TEST_MODE } from "./config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_HEIGHT = 70;
// BottomNavBar 점유 높이. nav 컴포넌트의 디자인 토큰이 나오면 한 곳으로 통합.
const BOTTOM_NAV_HEIGHT = 77;

export const BottomAnchorAdSlot = () => {
  const { enabled } = useAdsGate();
  const isNavVisible = useIsBottomNavVisible();
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
  const bottomOffset = isNavVisible ? BOTTOM_NAV_HEIGHT : 0;

  return (
    <div
      className="fixed inset-x-0 z-dropdown md:hidden overflow-hidden border-t border-gray-200 bg-white"
      style={{ height: AD_HEIGHT, bottom: bottomOffset }}
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
