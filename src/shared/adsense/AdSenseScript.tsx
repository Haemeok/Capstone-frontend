"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { isAppWebView } from "@/shared/lib/bridge/client";

import { ADSENSE_CLIENT_ID } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

export const AdSenseScript = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!isAdsEnabled()) return;
    if (isAppWebView()) return;
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) return null;

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
