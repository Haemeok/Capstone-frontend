"use client";

import { Info } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/shadcn/popover";

const DAY_MS = 24 * 60 * 60 * 1000;

const formatCollectedLabel = (iso: string): string => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / DAY_MS);
  // i18n-ignore: 쿠팡 슬라이드 ko 전용
  return days <= 0 ? "오늘 수집" : `${days}일 전 수집`;
};

type CoupangCollectedInfoProps = {
  lastCollectedAt: string;
};

export const CoupangCollectedInfo = ({
  lastCollectedAt,
}: CoupangCollectedInfoProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        aria-label="가격 안내" // i18n-ignore: 쿠팡 슬라이드 ko 전용
        onClick={() => triggerHaptic("Light")}
        className="text-ink-muted hover:text-ink-sub inline-flex cursor-pointer items-center transition-colors"
      >
        <Info size={16} />
      </button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      className="text-ink-sub w-56 p-3 text-xs leading-relaxed"
    >
      {/* i18n-ignore: 쿠팡 슬라이드 ko 전용 */}
      표시된 가격은 실제와 다를 수 있어요.
      <br />
      {/* i18n-ignore: 쿠팡 슬라이드 ko 전용 */}
      마지막 수집: {formatCollectedLabel(lastCollectedAt)}
    </PopoverContent>
  </Popover>
);
