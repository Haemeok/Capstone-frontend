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

const MountedAdSlot = ({
  slotId,
  minHeight,
  className,
  insStyle = DEFAULT_INS_STYLE,
  adFormat,
  adLayout,
  fullWidthResponsive,
  skeleton,
  onFillChange,
}: AdSlotProps & { slotId: string }) => {
  const insRef = useRef<HTMLModElement>(null);
  const [adStatus, setAdStatus] = useState<string | null>(null);
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
    const ins = insRef.current;
    if (!ins) return;
    let isActive = true;
    const updateStatus = () => {
      if (!isActive) return;
      const status = ins.getAttribute("data-ad-status");
      setAdStatus(status);
      onFillChangeRef.current?.(status === "filled");
    };
    if (ins.hasAttribute("data-ad-status")) {
      queueMicrotask(updateStatus);
    }
    const observer = new MutationObserver(updateStatus);
    observer.observe(ins, {
      attributes: true,
      attributeFilter: ["data-ad-status"],
    });

    return () => {
      isActive = false;
      observer.disconnect();
      onFillChangeRef.current?.(false);
    };
  }, []);

  return (
    <div
      className={cn("relative max-w-full overflow-x-clip", className)}
      style={{
        minHeight,
        display: adStatus === "unfilled" ? "none" : undefined,
      }}
    >
      {adStatus === null && skeleton ? (
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

export const AdSlot = (props: AdSlotProps) => {
  const { enabled } = useAdsGate();
  if (!enabled) return null;

  if (!props.slotId) {
    return IS_AD_TEST_MODE ? (
      <AdPlaceholder minHeight={props.minHeight} className={props.className} />
    ) : null;
  }

  return <MountedAdSlot key={props.slotId} {...props} slotId={props.slotId} />;
};
