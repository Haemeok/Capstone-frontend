"use client";

import { Gift } from "lucide-react";

import { formatRemaining } from "@/shared/lib/time/formatRemaining";

import { useAdFreeStatus } from "@/entities/user";

export const AdRemovalRow = ({ onOpenSheet }: { onOpenSheet: () => void }) => {
  const { isActive, remaining } = useAdFreeStatus();

  return (
    <button
      type="button"
      onClick={onOpenSheet}
      className="text-ink-sub flex w-full items-center justify-between px-4 py-3 hover:bg-gray-50"
    >
      <span className="flex items-center gap-2">
        <Gift size={16} />
        광고 제거
      </span>
      {isActive ? (
        <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-500">
          <span
            className="h-1.5 w-1.5 rounded-full bg-blue-500"
            aria-hidden="true"
          />
          {formatRemaining(remaining)} 남음
        </span>
      ) : (
        <span className="text-sm text-gray-400">광고 없이 즐기기</span>
      )}
    </button>
  );
};
