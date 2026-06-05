"use client";

import { Gift } from "lucide-react";

import { useCountdown } from "@/shared/lib/hooks/useCountdown";
import { formatRemaining } from "@/shared/lib/time/formatRemaining";

import { useUserStore } from "@/entities/user/model/store";

export const AdRemovalRow = ({ onOpenSheet }: { onOpenSheet: () => void }) => {
  const adFreeUntil = useUserStore((s) => s.user?.adStatus?.adFreeUntil);
  const showAds = useUserStore((s) => s.user?.adStatus?.showAds);
  const remaining = useCountdown(adFreeUntil ?? null);
  const isActive = showAds === false && remaining > 0;

  return (
    <button
      type="button"
      onClick={onOpenSheet}
      className="flex w-full items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
    >
      <span className="flex items-center gap-2">
        <Gift size={16} />
        광고 제거
      </span>
      <span className="text-sm text-gray-400">
        {isActive ? formatRemaining(remaining) : "광고 없이 즐기기"}
      </span>
    </button>
  );
};
