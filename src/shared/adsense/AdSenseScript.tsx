"use client";

import Script from "next/script";

import { ADSENSE_CLIENT_ID } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

export const AdSenseScript = () => {
  if (!isAdsEnabled()) return null;

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
