"use client";

import { type ReactNode, useMemo } from "react";

import { AdsGateContext, useAdsGate } from "@/shared/adsense/AdsGateContext";
import { useIsApp } from "@/shared/hooks/useIsApp";

type HomeAdsGateProps = {
  children: ReactNode;
};

export const HomeAdsGate = ({ children }: HomeAdsGateProps) => {
  const parentGate = useAdsGate();
  const isApp = useIsApp();
  const value = useMemo(
    () => (isApp ? { ...parentGate, enabled: false } : parentGate),
    [isApp, parentGate]
  );

  return (
    <AdsGateContext.Provider value={value}>{children}</AdsGateContext.Provider>
  );
};
