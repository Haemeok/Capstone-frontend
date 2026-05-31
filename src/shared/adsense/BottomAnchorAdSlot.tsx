"use client";

import { useEffect, useState } from "react";

import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

import { AnchorAdSlot } from "./AnchorAdSlot";
import { useAdsGate } from "./AdsGateContext";
import { AD_HEIGHT, AD_SLOT_IDS } from "./config";

const BOTTOM_NAV_HEIGHT = 77;

export const BottomAnchorAdSlot = () => {
  const { enabled } = useAdsGate();
  const isNavVisible = useIsBottomNavVisible();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  if (!enabled) return null;

  const bottomOffset = isNavVisible ? BOTTOM_NAV_HEIGHT : 0;

  return (
    <div
      className="fixed inset-x-0 z-dropdown overflow-hidden border-t border-gray-200 bg-white"
      style={{ height: AD_HEIGHT.bottomAnchor, bottom: bottomOffset }}
    >
      <AnchorAdSlot
        slotId={AD_SLOT_IDS.recipeBottomAnchor || undefined}
        height={AD_HEIGHT.bottomAnchor}
      />
    </div>
  );
};
