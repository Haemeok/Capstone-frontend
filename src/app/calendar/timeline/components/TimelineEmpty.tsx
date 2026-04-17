"use client";

import { UtensilsCrossed } from "lucide-react";

export const TimelineEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
      <UtensilsCrossed className="mb-3 h-12 w-12 text-gray-300" />
      <p className="text-base text-gray-400">아직 기록된 레시피가 없어요</p>
    </div>
  );
};
