"use client";

import { UtensilsCrossed } from "lucide-react";

import { useUserPagesDict } from "@/shared/i18n";

export const TimelineEmpty = () => {
  const t = useUserPagesDict().calendar;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
      <UtensilsCrossed className="mb-3 h-12 w-12 text-gray-300" />
      <p className="text-ink-muted text-base">{t.timelineEmpty}</p>
    </div>
  );
};
