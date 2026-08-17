"use client";

import { Check } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type {
  CookingRecordBackground,
  CookingRecordBackgroundCopy,
  CookingRecordBackgroundPreset,
} from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

const BACKGROUND_PRESETS: CookingRecordBackgroundPreset[] = [
  "dot",
  "linen",
  "tile",
  "wood",
];

type CookingRecordBackgroundOptionsProps = {
  selectedBackground: CookingRecordBackground;
  copy: CookingRecordBackgroundCopy;
  onSelectBackground: (background: CookingRecordBackground) => void;
};

export const CookingRecordBackgroundOptions = ({
  selectedBackground,
  copy,
  onSelectBackground,
}: CookingRecordBackgroundOptionsProps) => {
  const handlePresetSelect = (preset: CookingRecordBackgroundPreset) => {
    if (selectedBackground.kind === preset) return;
    triggerHaptic("Light");
    onSelectBackground({ kind: preset });
  };

  return (
    <>
      <h3 className="text-ink mt-5.5 text-sm font-bold">{copy.optionsTitle}</h3>
      <div
        role="group"
        aria-label={copy.optionsLabel}
        className="mt-3 grid grid-cols-4 gap-2.5"
      >
        {BACKGROUND_PRESETS.map((preset) => {
          const isSelected = selectedBackground.kind === preset;
          return (
            <button
              key={preset}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handlePresetSelect(preset)}
              className="text-ink-sub focus-visible:outline-olive-dark min-w-0 cursor-pointer rounded-xl text-[11px] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span
                className={cn(
                  "relative mb-1.5 block aspect-square overflow-hidden rounded-xl border bg-gray-100",
                  isSelected ? "border-olive-dark" : "border-gray-200",
                  getPresetClassName(preset)
                )}
              >
                {isSelected ? (
                  <Check
                    aria-hidden="true"
                    className="text-olive-dark absolute right-1.5 bottom-1.5 size-4 stroke-[2.5]"
                  />
                ) : null}
              </span>
              {copy.optionLabels[preset]}
            </button>
          );
        })}
      </div>
    </>
  );
};

const getPresetClassName = (preset: CookingRecordBackgroundPreset) => {
  if (preset === "dot") return styles.dot;
  if (preset === "linen") return styles.linen;
  if (preset === "tile") return styles.tile;
  return styles.wood;
};
