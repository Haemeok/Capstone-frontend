"use client";

import { useEffect } from "react";

import { useAdsGate } from "@/shared/adsense/AdsGateContext";
import { useBottomAdFillStore } from "@/shared/adsense/bottomAdFillStore";
import { AD_HEIGHT } from "@/shared/adsense/config";
import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

export const BottomLayoutController = () => {
  const isNavVisible = useIsBottomNavVisible();
  const { enabled: adsEnabled } = useAdsGate();
  const adFilled = useBottomAdFillStore((state) => state.filled);

  useEffect(() => {
    const navPart = isNavVisible ? "var(--bottom-nav-h)" : "0px";
    const adPart =
      adsEnabled && adFilled ? `${AD_HEIGHT.bottomAnchor}px` : "0px";
    document.documentElement.style.setProperty(
      "--main-pb",
      `calc(${navPart} + ${adPart})`
    );
  }, [isNavVisible, adsEnabled, adFilled]);

  return null;
};
