"use client";

import { Check } from "lucide-react";

import { format } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type { StickerBookBackgroundOption } from "@/entities/recipe";

import type { CookingRecordViewSettingsCopy } from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

type CookingRecordBackgroundOptionsProps = {
  backgrounds: StickerBookBackgroundOption[];
  selectedBackgroundKey?: string;
  copy: CookingRecordViewSettingsCopy;
  onSelectBackground: (backgroundKey: string) => void;
};

export const CookingRecordBackgroundOptions = ({
  backgrounds,
  selectedBackgroundKey,
  copy,
  onSelectBackground,
}: CookingRecordBackgroundOptionsProps) => (
  <>
    <h3 className="text-ink mt-5.5 text-sm font-bold">{copy.optionsTitle}</h3>
    <div
      role="group"
      aria-label={copy.optionsLabel}
      className="mt-3 grid grid-cols-4 gap-2.5"
    >
      {backgrounds.map((background, index) => {
        const isSelected = background.backgroundKey === selectedBackgroundKey;
        return (
          <button
            key={background.backgroundKey}
            type="button"
            aria-label={format(copy.optionLabel, { index: index + 1 })}
            aria-pressed={isSelected}
            onClick={() => {
              if (isSelected) return;
              triggerHaptic("Light");
              onSelectBackground(background.backgroundKey);
            }}
            className={cn(
              "focus-visible:outline-olive-dark relative aspect-square min-w-0 cursor-pointer overflow-hidden rounded-xl border focus-visible:outline-2 focus-visible:outline-offset-2",
              isSelected ? "border-olive-dark" : "border-gray-200",
              styles.dot
            )}
          >
            {background.imageUrl ? (
              <Image
                src={background.imageUrl}
                alt=""
                fit="cover"
                skeleton={<span aria-hidden="true" />}
                errorFallback={<span aria-hidden="true" />}
                wrapperClassName="absolute inset-0 h-full w-full"
              />
            ) : null}
            {isSelected ? (
              <Check
                aria-hidden="true"
                className="text-olive-dark absolute right-1.5 bottom-1.5 z-10 size-4 stroke-[2.5]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  </>
);
