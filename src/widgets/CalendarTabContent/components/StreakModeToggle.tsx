import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import { cn } from "@/lib/utils";

import { CalendarMode } from "../types";

type StreakModeToggleProps = {
  mode: CalendarMode;
  onModeChange: (mode: CalendarMode) => void;
};

export const StreakModeToggle = ({
  mode,
  onModeChange,
}: StreakModeToggleProps) => {
  const handleModeChange = (newMode: CalendarMode) => {
    if (mode !== newMode) {
      triggerHaptic("Light");
      onModeChange(newMode);
    }
  };

  return (
    <div className="inline-flex gap-2">
      <button
        type="button"
        onClick={() => handleModeChange("photo")}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
          mode === "photo"
            ? "text-ink bg-gray-200"
            : "text-ink-muted hover:bg-gray-100"
        )}
      >
        <Image
          src={`${ICON_BASE_URL}record_camera.webp`}
          alt="기록"
          wrapperClassName="w-6 h-6"
          lazy={false}
        />
        기록
      </button>

      <button
        type="button"
        onClick={() => handleModeChange("streak")}
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
          mode === "streak"
            ? "text-ink bg-gray-200"
            : "text-ink-muted hover:bg-gray-100"
        )}
      >
        <Image
          src={`${ICON_BASE_URL}streak_fire.webp`}
          alt="스트릭"
          wrapperClassName="w-6 h-6"
          lazy={false}
        />
        스트릭
      </button>
    </div>
  );
};
