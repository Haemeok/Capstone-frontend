"use client";

import { Gift } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useReferralSheetStore } from "@/entities/referral";

export const ReferralGiftButton = () => {
  const open = useReferralSheetStore((s) => s.open);

  return (
    <button
      type="button"
      aria-label="친구 초대 이벤트"
      onClick={() => {
        triggerHaptic("Light");
        open();
      }}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors hover:bg-gray-50"
    >
      <Gift size={18} aria-hidden="true" />
    </button>
  );
};
