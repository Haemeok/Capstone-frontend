"use client";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import type {
  StickerBookBackground,
  StickerBookBackgroundOption,
} from "@/entities/recipe";

import { CookingRecordBackgroundOptions } from "./CookingRecordBackgroundOptions";
import type {
  CookingRecordBackgroundCopy,
  CookingRecordStickerItem,
} from "./cookingRecordUi.types";
import styles from "./MonthlyCookingRecord.module.css";

type CookingRecordBackgroundPickerProps = {
  backgrounds: StickerBookBackgroundOption[];
  previewBackground: StickerBookBackground | null;
  selectedBackgroundKey?: string;
  previewRecords: CookingRecordStickerItem[];
  copy: CookingRecordBackgroundCopy;
  isListPending: boolean;
  isListError: boolean;
  isApplying: boolean;
  onSelectBackground: (backgroundKey: string) => void;
  onRetry: () => void;
  onApply: () => void;
};

export const CookingRecordBackgroundPicker = ({
  backgrounds,
  previewBackground,
  selectedBackgroundKey,
  previewRecords,
  copy,
  isListPending,
  isListError,
  isApplying,
  onSelectBackground,
  onRetry,
  onApply,
}: CookingRecordBackgroundPickerProps) => (
  <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-6">
    <p className="text-ink-sub text-sm leading-5.5">{copy.intro}</p>
    <div
      aria-label={copy.previewLabel}
      className={cn(
        "relative mt-4.5 h-36 overflow-hidden rounded-2xl",
        styles.dot
      )}
    >
      {previewBackground?.imageUrl ? (
        <Image
          src={previewBackground.imageUrl}
          alt=""
          fit="cover"
          skeleton={<span aria-hidden="true" />}
          errorFallback={<span aria-hidden="true" />}
          wrapperClassName="absolute inset-0 h-full w-full"
          imgClassName="object-top"
        />
      ) : null}
      {previewRecords.slice(0, 2).map((record, index) => (
        <Image
          key={record.id}
          src={record.imageUrl}
          alt={record.imageAlt}
          aspectRatio="1 / 1"
          fit="contain"
          wrapperClassName={cn(
            "absolute z-10 h-20 w-24 overflow-visible",
            index === 0
              ? "top-5 left-[22%] -rotate-3"
              : "right-[20%] bottom-4 rotate-3"
          )}
          imgClassName="object-contain drop-shadow-[0_5px_6px_rgb(34_34_34/0.16)]"
        />
      ))}
    </div>

    {isListPending ? (
      <p role="status" className="text-ink-muted mt-6 text-center text-sm">
        {copy.loading}
      </p>
    ) : isListError ? (
      <div className="mt-6 text-center">
        <p role="alert" className="text-ink-sub text-sm">
          {copy.error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="text-ink focus-visible:outline-olive-dark mt-3 min-h-11 cursor-pointer rounded-xl border border-gray-200 px-4 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {copy.retry}
        </button>
      </div>
    ) : (
      <CookingRecordBackgroundOptions
        backgrounds={backgrounds}
        selectedBackgroundKey={selectedBackgroundKey}
        copy={copy}
        onSelectBackground={onSelectBackground}
      />
    )}

    <button
      type="button"
      disabled={!selectedBackgroundKey || isApplying || isListError}
      onClick={onApply}
      className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark disabled:text-ink-disabled mt-4.5 min-h-12.5 w-full cursor-pointer rounded-[13px] text-[15px] font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
    >
      {isApplying ? copy.applying : copy.apply}
    </button>
  </div>
);
