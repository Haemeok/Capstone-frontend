"use client";

import { useEffect } from "react";

import { format, useUiCommonDict } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import {
  STEP_FONT_LEVEL_COUNT,
  useStepFontSizeStore,
} from "../model/useStepFontSizeStore";

const GLYPH_SIZE = ["text-sm", "text-base", "text-lg"];

const StepFontSizeButton = () => {
  const t = useUiCommonDict().stepFontSize;
  const level = useStepFontSizeStore((state) => state.level);
  const cycle = useStepFontSizeStore((state) => state.cycle);

  useEffect(() => {
    useStepFontSizeStore.persist.rehydrate();
  }, []);

  const handleCycle = () => {
    triggerHaptic("Light");
    cycle();
  };

  return (
    <button
      onClick={handleCycle}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg transition-colors duration-300",
        level > 0
          ? "bg-olive-light shadow-olive-light/30 text-white"
          : "text-ink-sub bg-gray-100"
      )}
      aria-label={format(t.toggleAria, {
        current: level + 1,
        total: STEP_FONT_LEVEL_COUNT,
      })}
    >
      <span className={GLYPH_SIZE[level]}>{t.sampleGlyph}</span>
    </button>
  );
};

export default StepFontSizeButton;
