"use client";

import { useEffect } from "react";

import { useAdsGate } from "@/shared/adsense/AdsGateContext";
import { useIsBottomNavVisible } from "@/shared/hooks/useIsBottomNavVisible";

const NAV_PB_PX = 77;
const AD_PB_PX = 70;

export const BottomLayoutController = () => {
  const isNavVisible = useIsBottomNavVisible();
  const { enabled: adsEnabled } = useAdsGate();

  useEffect(() => {
    const navPx = isNavVisible ? NAV_PB_PX : 0;
    const adPx = adsEnabled ? AD_PB_PX : 0;
    const total = navPx + adPx;
    document.documentElement.style.setProperty(
      "--main-pb",
      total > 0 ? `${total}px` : "0px"
    );
  }, [isNavVisible, adsEnabled]);

  return null;
};
