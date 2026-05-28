"use client";

import { createContext, useContext } from "react";

export type AdsGateValue = {
  enabled: boolean;
  isTestUser: boolean;
};

const DEFAULT_VALUE: AdsGateValue = { enabled: false, isTestUser: false };

export const AdsGateContext = createContext<AdsGateValue>(DEFAULT_VALUE);

export const useAdsGate = (): AdsGateValue => useContext(AdsGateContext);
