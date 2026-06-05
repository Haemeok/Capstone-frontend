"use client";

import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";
import { useIsHydrated } from "@/shared/hooks/useIsHydrated";

import { useAdsGate } from "./AdsGateContext";
import { AnchorAdSlot } from "./AnchorAdSlot";
import { AD_HEIGHT, AD_SLOT_IDS } from "./config";

export const BottomAnchorAdSlot = () => {
  const { enabled } = useAdsGate();
  const isNavVisible = useIsBottomNavVisible();
  const hydrated = useIsHydrated();

  if (!hydrated) return null;
  if (!enabled) return null;

  const bottomClass = isNavVisible
    ? "bottom-[var(--bottom-nav-h)]"
    : "bottom-0";

  return (
    <div
      className={`fixed inset-x-0 ${bottomClass} z-dropdown overflow-hidden border-t border-gray-200 bg-white md:bottom-0 md:mx-auto md:max-w-4xl`}
      style={{ height: AD_HEIGHT.bottomAnchor }}
    >
      <AnchorAdSlot
        slotId={AD_SLOT_IDS.recipeBottomAnchor || undefined}
        height={AD_HEIGHT.bottomAnchor}
      />
    </div>
  );
};
