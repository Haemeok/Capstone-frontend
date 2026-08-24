"use client";

import { useUserPagesDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { CalendarMode } from "../types";

type StreakModeToggleProps = {
  mode: CalendarMode;
  onModeChange: (mode: CalendarMode) => void;
};

export const StreakModeToggle = ({
  mode,
  onModeChange,
}: StreakModeToggleProps) => {
  const t = useUserPagesDict();

  const handleModeChange = (newMode: CalendarMode) => {
    if (mode !== newMode) {
      triggerHaptic("Light");
      onModeChange(newMode);
    }
  };

  return (
    <div className="inline-flex rounded-xl bg-gray-100 p-1">
      <button
        type="button"
        aria-pressed={mode === "photo"}
        onClick={() => handleModeChange("photo")}
        className={cn(
          "min-h-11 cursor-pointer rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-colors",
          mode === "photo"
            ? "text-ink bg-white shadow-sm"
            : "text-ink-muted hover:text-ink"
        )}
      >
        {t.calendar.toggleRecord}
      </button>

      <button
        type="button"
        aria-pressed={mode === "streak"}
        onClick={() => handleModeChange("streak")}
        className={cn(
          "min-h-11 cursor-pointer rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-colors",
          mode === "streak"
            ? "text-ink bg-white shadow-sm"
            : "text-ink-muted hover:text-ink"
        )}
      >
        {t.calendar.toggleStreak}
      </button>
    </div>
  );
};
