"use client";

import { useEffect } from "react";

import { useAdsGate } from "@/shared/adsense/AdsGateContext";
import { AD_HEIGHT } from "@/shared/adsense/config";
import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

export const BottomLayoutController = () => {
  const isNavVisible = useIsBottomNavVisible();
  const { enabled: adsEnabled } = useAdsGate();

  useEffect(() => {
    const navPart = isNavVisible ? "var(--bottom-nav-h)" : "0px";
    const adPart = adsEnabled ? `${AD_HEIGHT.bottomAnchor}px` : "0px";
    document.documentElement.style.setProperty(
      "--main-pb",
      `calc(${navPart} + ${adPart})`
    );
  }, [isNavVisible, adsEnabled]);

  return null;
};
