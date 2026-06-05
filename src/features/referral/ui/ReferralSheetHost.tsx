"use client";

import { useReferralSheetStore } from "@/entities/referral";

import { ReferralSheet } from "./ReferralSheet";

export const ReferralSheetHost = () => {
  const isOpen = useReferralSheetStore((s) => s.isOpen);
  const close = useReferralSheetStore((s) => s.close);

  return <ReferralSheet open={isOpen} onOpenChange={(o) => !o && close()} />;
};
