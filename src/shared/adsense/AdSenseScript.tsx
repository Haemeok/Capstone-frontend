"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

import { isAppWebView } from "@/shared/lib/bridge";

import { ADSENSE_CLIENT_ID } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

export const AdSenseScript = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!isAdsEnabled()) return;
    // RN WebView에서는 adsbygoogle.js를 띄우지 않는다. <ins> 슬롯이 DOM에 남아도
    // (모바일은 CSS로 hidden 처리되어 있다) 처리할 스크립트가 없으면 cookie/consent
    // sync가 트리거되지 않아 zrt_lookup_fy2021.html로의 의도치 않은 top-level
    // navigation을 막을 수 있다. 데스크톱/모바일 웹은 그대로 광고를 받는다.
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
