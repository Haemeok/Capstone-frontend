"use client";

import { useEffect, useRef } from "react";

import { AdPlaceholder } from "./AdPlaceholder";
import { ADSENSE_CLIENT_ID, IS_AD_TEST_MODE } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADBLOCK_DETECTION_TIMEOUT_MS = 3000;

type AdSlotProps = {
  slotId: string | undefined;
  format?: "auto" | "fluid";
  layout?: "in-article";
  layoutKey?: string;
  fullWidthResponsive?: boolean;
  minHeight: number;
  className?: string;
};

export const AdSlot = ({
  slotId,
  format = "auto",
  layout,
  layoutKey,
  fullWidthResponsive = true,
  minHeight,
  className,
}: AdSlotProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const didPushRef = useRef(false);

  useEffect(() => {
    if (didPushRef.current) return;
    if (!insRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      didPushRef.current = true;
    } catch {
      // adblock / network failure — silent
    }
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const ins = insRef.current;
    if (!wrapper || !ins) return;
    const timer = window.setTimeout(() => {
      if (!ins.firstChild) {
        wrapper.style.display = "none";
      }
    }, ADBLOCK_DETECTION_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isAdsEnabled()) return null;

  if (!slotId) {
    return IS_AD_TEST_MODE ? (
      <AdPlaceholder minHeight={minHeight} className={className} />
    ) : null;
  }

  return (
    <div ref={wrapperRef} className={className} style={{ minHeight }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        data-adtest={IS_AD_TEST_MODE ? "on" : undefined}
      />
    </div>
  );
};
