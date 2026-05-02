"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { AdSlot } from "./AdSlot";
import { AD_MIN_HEIGHT, AD_SLOT_IDS } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

const DISMISS_KEY = "ad:bottomAnchor:dismissed";

export const BottomAnchorAdSlot = () => {
  const [hydrated, setHydrated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setHydrated(true);
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  if (!hydrated) return null;
  if (dismissed) return null;
  if (!isAdsEnabled()) return null;

  const handleDismiss = () => {
    triggerHaptic("Light");
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-dropdown md:hidden h-[70px] border-t border-gray-200 bg-white">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="광고 닫기"
        className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
      >
        <X size={14} />
      </button>
      <AdSlot
        slotId={AD_SLOT_IDS.recipeBottomAnchor || undefined}
        format="auto"
        minHeight={AD_MIN_HEIGHT.bottomAnchor}
        className="h-full w-full"
      />
    </div>
  );
};
