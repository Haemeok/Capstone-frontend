"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/lib/utils";

import { AdPlaceholder } from "./AdPlaceholder";
import { useAdsGate } from "./AdsGateContext";
import { ADSENSE_CLIENT_ID, IS_AD_TEST_MODE } from "./config";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
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
  onFillChange?: (filled: boolean) => void;
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
  onFillChange,
}: AdSlotProps) => {
  const { enabled } = useAdsGate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const [isFilled, setIsFilled] = useState(false);
  const pushedRef = useRef(false);
  const onFillChangeRef = useRef(onFillChange);

  useEffect(() => {
    onFillChangeRef.current = onFillChange;
  }, [onFillChange]);

  useEffect(() => {
    const ins = insRef.current;
    if (!ins) return;
    if (pushedRef.current) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;
    pushedRef.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      pushedRef.current = true;
    }
  }, [slotId]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const ins = insRef.current;
    if (!wrapper || !ins) return;
    const markFilled = () => {
      setIsFilled(true);
      onFillChangeRef.current?.(true);
    };
    if (ins.firstChild) {
      queueMicrotask(markFilled);
    }
    const observer = new MutationObserver(() => {
      if (ins.firstChild) {
        markFilled();
        observer.disconnect();
      }
    });
    observer.observe(ins, { childList: true });

    let timer: number | undefined;
    const startAdblockTimer = () => {
      if (timer !== undefined) return;
      timer = window.setTimeout(() => {
        if (!ins.firstChild) {
          wrapper.style.display = "none";
        }
        observer.disconnect();
      }, ADBLOCK_DETECTION_TIMEOUT_MS);
    };

    let viewportObserver: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "function") {
      viewportObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          viewportObserver?.disconnect();
          startAdblockTimer();
        },
        { rootMargin: "200px" }
      );
      viewportObserver.observe(wrapper);
    } else {
      startAdblockTimer();
    }

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      observer.disconnect();
      viewportObserver?.disconnect();
      onFillChangeRef.current?.(false);
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
        <div aria-hidden className="pointer-events-none absolute inset-0">
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
        data-full-width-responsive={fullWidthResponsive ? "true" : undefined}
        data-adtest={IS_AD_TEST_MODE ? "on" : undefined}
      />
    </div>
  );
};
