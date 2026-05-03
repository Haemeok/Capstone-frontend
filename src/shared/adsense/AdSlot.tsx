"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { AdPlaceholder } from "./AdPlaceholder";
import { ADSENSE_CLIENT_ID, IS_AD_TEST_MODE } from "./config";
import { isAdsEnabled } from "./lib/isAdsEnabled";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADBLOCK_DETECTION_TIMEOUT_MS = 3000;
const DEFAULT_INS_STYLE: CSSProperties = { display: "block" };

type AdSlotProps = {
  slotId: string | undefined;
  minHeight: number;
  className?: string;
  insStyle?: CSSProperties;
};

export const AdSlot = ({
  slotId,
  minHeight,
  className,
  insStyle = DEFAULT_INS_STYLE,
}: AdSlotProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
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
        style={insStyle}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-adtest={IS_AD_TEST_MODE ? "on" : undefined}
      />
    </div>
  );
};
