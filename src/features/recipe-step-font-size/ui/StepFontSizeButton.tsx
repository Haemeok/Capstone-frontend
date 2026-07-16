"use client";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import { useStepFontSizeStore } from "../model/useStepFontSizeStore";

const StepFontSizeButton = () => {
  const { isLarge, toggle } = useStepFontSizeStore();

  const handleToggle = () => {
    triggerHaptic("Light");
    toggle();
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg transition-colors duration-300",
        isLarge
          ? "bg-olive-light shadow-olive-light/30 text-white"
          : "text-ink-sub bg-gray-100"
      )}
      aria-label={isLarge ? "글자 크기 작게" : "글자 크기 크게"}
      aria-pressed={isLarge}
    >
      <span className={isLarge ? "text-lg" : "text-sm"}>가</span>
    </button>
  );
};

export default StepFontSizeButton;
