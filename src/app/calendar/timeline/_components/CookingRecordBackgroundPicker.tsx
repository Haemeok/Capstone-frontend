"use client";

import { type ChangeEvent, useId } from "react";

import { ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { CookingRecordBackgroundOptions } from "./CookingRecordBackgroundOptions";
import type {
  CookingRecordBackground,
  CookingRecordBackgroundCopy,
  CookingRecordStickerItem,
} from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

type CookingRecordBackgroundPickerProps = {
  monthLabel: string;
  selectedBackground: CookingRecordBackground;
  previewRecords: CookingRecordStickerItem[];
  copy: CookingRecordBackgroundCopy;
  onSelectBackground: (background: CookingRecordBackground) => void;
  onCustomImageChange: (file: File) => void;
  onApply: () => void;
};

export const CookingRecordBackgroundPicker = ({
  monthLabel,
  selectedBackground,
  previewRecords,
  copy,
  onSelectBackground,
  onCustomImageChange,
  onApply,
}: CookingRecordBackgroundPickerProps) => {
  const customImageInputId = useId();
  const previewStyle =
    selectedBackground.kind === "custom"
      ? {
          backgroundImage: `url(${JSON.stringify(selectedBackground.imageUrl)})`,
        }
      : undefined;

  const handleCustomImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onCustomImageChange(file);
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-6">
      <p className="text-ink-sub text-sm leading-5.5">{copy.intro}</p>
      <div
        aria-label={`${monthLabel} ${copy.previewLabel}`}
        style={previewStyle}
        className={cn(
          "relative mt-4.5 h-36 overflow-hidden rounded-2xl bg-cover bg-center",
          getBackgroundClassName(selectedBackground)
        )}
      >
        {previewRecords.slice(0, 2).map((record, index) => (
          <Image
            key={record.id}
            src={record.imageUrl}
            alt={record.imageAlt}
            aspectRatio="1 / 1"
            fit="contain"
            wrapperClassName={cn(
              "absolute h-20 w-24 overflow-visible",
              index === 0
                ? "top-5 left-[22%] -rotate-3"
                : "right-[20%] bottom-4 rotate-3"
            )}
            imgClassName="object-contain drop-shadow-[0_5px_6px_rgb(34_34_34/0.16)]"
          />
        ))}
      </div>

      <CookingRecordBackgroundOptions
        selectedBackground={selectedBackground}
        copy={copy}
        onSelectBackground={onSelectBackground}
      />

      <label
        htmlFor={customImageInputId}
        className="text-ink focus-within:outline-olive-dark mt-4.5 flex min-h-12 cursor-pointer items-center justify-between border-y border-gray-200 text-sm font-bold focus-within:outline-2 focus-within:outline-offset-2"
      >
        {copy.customBackground}
        <ChevronRight
          aria-hidden="true"
          className="text-ink-muted size-[18px]"
        />
      </label>
      <input
        id={customImageInputId}
        type="file"
        accept="image/*"
        onChange={handleCustomImageChange}
        className="sr-only"
      />
      <button
        type="button"
        onClick={onApply}
        className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark mt-4.5 min-h-12.5 w-full cursor-pointer rounded-[13px] text-[15px] font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {copy.apply}
      </button>
    </div>
  );
};

const getBackgroundClassName = (background: CookingRecordBackground) => {
  if (background.kind === "custom") return styles.custom;
  if (background.kind === "dot") return styles.dot;
  if (background.kind === "linen") return styles.linen;
  if (background.kind === "tile") return styles.tile;
  return styles.wood;
};
