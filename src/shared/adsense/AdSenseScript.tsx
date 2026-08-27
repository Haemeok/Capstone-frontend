"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

import { useIsApp } from "@/shared/hooks/useIsApp";

import { useAdsGate } from "./AdsGateContext";
import { ADSENSE_CLIENT_ID } from "./config";

const HOME_PATHNAMES = new Set(["/", "/en", "/ja"]);

export const AdSenseScript = () => {
  const { enabled } = useAdsGate();
  const pathname = usePathname();
  const isApp = useIsApp();
  const isAppHome = isApp && HOME_PATHNAMES.has(pathname);

  useEffect(() => {
    if (!isAppHome) return;

    const removeAutoAds = () => {
      document
        .querySelectorAll("ins.adsbygoogle-noablate")
        .forEach((element) => element.remove());
    };

    removeAutoAds();
    const observer = new MutationObserver(removeAutoAds);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isAppHome]);

  if (!enabled || isAppHome) return null;

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
