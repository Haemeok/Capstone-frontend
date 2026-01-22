import { cn } from "@/lib/utils";

import { ICON_BASE_URL } from "@/shared/config/constants/recipe";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

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
        onClick={() => handleModeChange("streak")}
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
          mode === "streak"
            ? "bg-gray-200 text-gray-800"
            : "text-gray-500 hover:bg-gray-100"
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

      <button
        type="button"
        onClick={() => handleModeChange("photo")}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
          mode === "photo"
            ? "bg-gray-200 text-gray-800"
            : "text-gray-500 hover:bg-gray-100"
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
    </div>
  );
};
