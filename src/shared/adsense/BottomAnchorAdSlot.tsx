"use client";

import { useEffect, useRef, useState } from "react";

import { AdPlaceholder } from "./AdPlaceholder";
import { ADSENSE_CLIENT_ID, AD_SLOT_IDS, IS_AD_TEST_MODE } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AD_HEIGHT = 70;

export const BottomAnchorAdSlot = () => {
  const [hydrated, setHydrated] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const ins = insRef.current;
    if (!ins) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adblock / network failure — silent
    }
  }, [hydrated]);

  if (!hydrated) return null;
  if (!isAdsEnabled()) return null;

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
