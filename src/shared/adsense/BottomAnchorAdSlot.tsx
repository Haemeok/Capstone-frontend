"use client";

import { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { AdPlaceholder } from "./AdPlaceholder";
import { ADSENSE_CLIENT_ID, AD_SLOT_IDS, IS_AD_TEST_MODE } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const DISMISS_KEY = "ad:bottomAnchor:dismissed";
const AD_HEIGHT = 70;

export const BottomAnchorAdSlot = () => {
  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    setHydrated(true);
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || dismissed) return;
    const ins = insRef.current;
    if (!ins) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adblock / network failure — silent
    }
  }, [hydrated, dismissed]);

  if (!hydrated) return null;
  if (dismissed) return null;
  if (!isAdsEnabled()) return null;

  const slotId = AD_SLOT_IDS.recipeBottomAnchor || undefined;

  const handleDismiss = () => {
    triggerHaptic("Light");
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-dropdown md:hidden overflow-hidden border-t border-gray-200 bg-white"
      style={{ height: AD_HEIGHT }}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="광고 닫기"
        className="absolute top-1 right-1 z-30 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
      >
        <X size={14} />
      </button>
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
