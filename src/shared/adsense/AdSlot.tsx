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

// 3초는 모바일/지연 응답에서 너무 빨리 포기해 정상 fill 가능한 광고도 영역이
// 사라지는 사례가 잦았다. 7초까지 늘려도 사용자가 보는 건 스켈레톤이라 빈칸
// 체감이 없고, 그 안에 fill되지 않으면 adblock 또는 no-fill로 간주해 collapse.
const ADBLOCK_DETECTION_TIMEOUT_MS = 7000;
const DEFAULT_INS_STYLE: CSSProperties = { display: "block" };

type AdSlotProps = {
  slotId: string | undefined;
  minHeight: number;
  className?: string;
  insStyle?: CSSProperties;
  // AdSense 콘솔에서 슬롯이 fluid in-article 형태로 등록된 경우, 동일한 슬롯 ID를
  // 한 페이지에 여러 번 박을 수 있다. 그때 <ins>에 반드시 data-ad-format="fluid"
  // + data-ad-layout="in-article"를 함께 줘야 한다. 빠지면 슬롯 형식이 매칭되지
  // 않아 TagError가 발생한다 (특히 같은 페이지에 2번 이상 박을 때 가장 자주 터짐).
  adFormat?: string;
  adLayout?: string;
  // Display 광고가 콘솔에서 "반응형(auto + full-width-responsive)"로 등록된
  // 경우 이 플래그를 켜면 <ins>에 data-full-width-responsive="true"를 박는다.
  fullWidthResponsive?: boolean;
  // 광고 fill 전까지 노출할 자리. 흰칸을 피하려고 호출 측이 카드와 비슷한
  // 스켈레톤을 넘긴다. ins.firstChild가 생기는 시점에 자동 제거된다.
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
  // StrictMode dev에서 effect가 두 번 실행되거나 동일 페이지에 다수 슬롯이
  // 같은 시점에 마운트되는 경우, data-adsbygoogle-status 속성은 비동기로 set돼
  // 두 번째 push를 못 막는다. 컴포넌트 인스턴스 단위 동기 가드를 한 겹 더 둔다.
  const pushedRef = useRef(false);
  // [DEBUG] 인스턴스 식별용 일련번호. AdSlot이 몇 번 마운트됐는지, 같은 인스턴스에서
  // effect가 몇 번 돌았는지 구분하려고 사용. 측정 끝나면 제거.
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
    // AdSense 스크립트가 fill에 성공하면 ins 안에 iframe을 자식으로 넣는다.
    // 그 시점을 잡아 스켈레톤을 내린다. ins.firstChild를 폴링하지 않고
    // MutationObserver로 비용 없이 1회성 감지.
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
