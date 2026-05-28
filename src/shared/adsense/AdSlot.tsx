"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/shared/lib/utils";

import { AdPlaceholder } from "./AdPlaceholder";
import { useAdsGate } from "./AdsGateContext";
import { ADSENSE_CLIENT_ID, IS_AD_TEST_MODE } from "./config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __adPushCount?: number;
    __adInstanceSeq?: number;
  }
}

const ADBLOCK_DETECTION_TIMEOUT_MS = 7000;
const DEFAULT_INS_STYLE: CSSProperties = { display: "block" };

type AdSlotProps = {
  slotId: string | undefined;
  minHeight: number;
  className?: string;
  insStyle?: CSSProperties;
  adFormat?: string;
  adLayout?: string;
  fullWidthResponsive?: boolean;
  skeleton?: ReactNode;
};

export const AdSlot = ({
  slotId,
  minHeight,
  className,
  insStyle = DEFAULT_INS_STYLE,
  adFormat,
  adLayout,
  fullWidthResponsive,
  skeleton,
}: AdSlotProps) => {
  const { enabled } = useAdsGate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [isFilled, setIsFilled] = useState(false);
  const pushedRef = useRef(false);
  const instanceIdRef = useRef<number | null>(null);
  if (instanceIdRef.current === null && typeof window !== "undefined") {
    window.__adInstanceSeq = (window.__adInstanceSeq ?? 0) + 1;
    instanceIdRef.current = window.__adInstanceSeq;
  }

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) {
      console.log("[AdSlot effect]", {
        instanceId: instanceIdRef.current,
        slotId,
        skip: "ins ref null",
      });
      return;
    }
    const totalIns = document.querySelectorAll("ins.adsbygoogle").length;
    const unfilledIns = document.querySelectorAll(
      "ins.adsbygoogle:not([data-adsbygoogle-status])",
    ).length;
    const insSlot = ins.getAttribute("data-ad-slot");
    const insStatus = ins.getAttribute("data-adsbygoogle-status");
    const baseInfo = {
      instanceId: instanceIdRef.current,
      slotIdProp: slotId,
      insSlot,
      insStatus,
      pushedRef: pushedRef.current,
      totalIns,
      unfilledIns,
      globalPushCount: window.__adPushCount ?? 0,
    };
    if (pushedRef.current) {
      console.log("[AdSlot effect skip pushedRef]", baseInfo);
      return;
    }
    if (insStatus) {
      console.log("[AdSlot effect skip statusAttr]", baseInfo);
      return;
    }
    pushedRef.current = true;
    window.__adPushCount = (window.__adPushCount ?? 0) + 1;
    console.log("[AdSlot effect pushing]", {
      ...baseInfo,
      globalPushCountAfter: window.__adPushCount,
    });
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("[AdSlot push threw]", { ...baseInfo, error: String(e) });
    }
  }, [slotId]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const ins = insRef.current;
    if (!wrapper || !ins) return;
    if (ins.firstChild) {
      setIsFilled(true);
    }
    const observer = new MutationObserver(() => {
      if (ins.firstChild) {
        setIsFilled(true);
        observer.disconnect();
      }
    });
    observer.observe(ins, { childList: true });
    const timer = window.setTimeout(() => {
      if (!ins.firstChild) {
        wrapper.style.display = "none";
      }
      observer.disconnect();
    }, ADBLOCK_DETECTION_TIMEOUT_MS);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!enabled) return null;

  if (!slotId) {
    return IS_AD_TEST_MODE ? (
      <AdPlaceholder minHeight={minHeight} className={className} />
    ) : null;
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative max-w-full overflow-x-clip", className)}
      style={{ minHeight }}
    >
      {!isFilled && skeleton ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          {skeleton}
        </div>
      ) : null}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ ...insStyle, maxWidth: "100%" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={
          fullWidthResponsive ? "true" : undefined
        }
        data-adtest={IS_AD_TEST_MODE ? "on" : undefined}
      />
    </div>
  );
};
