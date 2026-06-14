"use client";

import { useState } from "react";

import { Gift } from "lucide-react";

import { useReferralDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

import {
  shouldShowNudge,
  useReferralInfoQuery,
  useReferralSheetStore,
} from "@/entities/referral";

type ReferralGiftButtonProps = { enabled?: boolean };

export const ReferralGiftButton = ({
  enabled = true,
}: ReferralGiftButtonProps) => {
  const open = useReferralSheetStore((s) => s.open);
  const lastOpenedAt = useReferralSheetStore((s) => s.lastOpenedAt);
  const { data } = useReferralInfoQuery(enabled);
  const [mountedAt] = useState<number>(() => Date.now());
  const t = useReferralDict();

  const showDot = shouldShowNudge({
    campaignActive: Boolean(data?.campaign),
    lastOpenedAt,
    now: mountedAt,
  });

  return (
    <button
      type="button"
      aria-label={t.giftAria}
      onClick={() => {
        triggerHaptic("Light");
        open();
      }}
      className="text-ink relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50"
    >
      <Gift size={18} aria-hidden="true" />
      {showDot && (
        <span
          data-testid="referral-nudge-dot"
          className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"
        />
      )}
    </button>
  );
};
