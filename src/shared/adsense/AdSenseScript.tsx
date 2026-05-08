"use client";

import Script from "next/script";

import { useAdsGate } from "./AdsGateContext";
import { ADSENSE_CLIENT_ID } from "./config";

export const AdSenseScript = () => {
  const { enabled } = useAdsGate();

  if (!enabled) return null;

  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={src}
      crossOrigin="anonymous"
    />
  );
};
