import { cn } from "@/lib/utils";

import { CalendarMode } from "../types";
import { Fire } from "./fire";

type StreakModeToggleProps = {
  mode: CalendarMode;
  onModeChange: (mode: CalendarMode) => void;
};

export const StreakModeToggle = ({
  mode,
  onModeChange,
}: StreakModeToggleProps) => {
  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => onModeChange("streak")}
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
          mode === "streak"
            ? "bg-gray-200 text-gray-800"
            : "text-gray-500 hover:bg-gray-100"
        )}
      >
        <Fire width={24} height={24} />
        스트릭
      </button>

      <button
        type="button"
        onClick={() => onModeChange("photo")}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
          mode === "photo"
            ? "bg-gray-200 text-gray-800"
            : "text-gray-500 hover:bg-gray-100"
        )}
      >
        📸 기록
      </button>
    </div>
  );
};
