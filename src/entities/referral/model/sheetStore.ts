import { create } from "zustand";

import { storage } from "@/shared/lib/storage";

export const REFERRAL_LAST_OPENED_KEY = "recipio-referral-last-opened-at";

type ReferralSheetStore = {
  isOpen: boolean;
  lastOpenedAt: number | null;
  open: () => void;
  close: () => void;
};

const readLastOpenedAt = (): number | null => {
  const raw = storage.getItem(REFERRAL_LAST_OPENED_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export const useReferralSheetStore = create<ReferralSheetStore>((set) => ({
  isOpen: false,
  lastOpenedAt: readLastOpenedAt(),

  open: () => {
    const now = Date.now();
    storage.setItem(REFERRAL_LAST_OPENED_KEY, String(now));
    set({ isOpen: true, lastOpenedAt: now });
  },

  close: () => set({ isOpen: false }),
}));
