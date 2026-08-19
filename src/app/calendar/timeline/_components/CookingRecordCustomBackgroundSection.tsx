"use client";

import { useId } from "react";

import { ImagePlus } from "lucide-react";

import { format } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { cn } from "@/shared/lib/utils";

import type { StickerBookBackgroundOption } from "@/entities/recipe";

import { CookingRecordCustomBackgroundOption } from "./CookingRecordCustomBackgroundOption";
import type { CookingRecordViewSettingsCopy } from "./cookingRecordUi.types";

const MAX_CUSTOM_BACKGROUND_COUNT = 20;

type CustomBackgroundCopy = Pick<
  CookingRecordViewSettingsCopy,
  | "customTitle"
  | "customOptionsLabel"
  | "addCustom"
  | "customLimit"
  | "addingCustom"
  | "optionLabel"
>;

type CookingRecordCustomBackgroundSectionProps = {
  backgrounds: StickerBookBackgroundOption[];
  selectedBackgroundKey?: string;
  copy: CustomBackgroundCopy;
  errorMessage?: string;
  retryLabel?: string;
  statusMessage?: string;
  isPending: boolean;
  onAddCustomBackground: (file: File) => void;
  onRetryRegistration?: () => void;
  onSelectBackground: (backgroundKey: string) => void;
};

export const CookingRecordCustomBackgroundSection = ({
  backgrounds,
  selectedBackgroundKey,
  copy,
  errorMessage,
  retryLabel,
  statusMessage,
  isPending,
  onAddCustomBackground,
  onRetryRegistration,
  onSelectBackground,
}: CookingRecordCustomBackgroundSectionProps) => {
  const inputId = useId();
  const isLimitReached = backgrounds.length >= MAX_CUSTOM_BACKGROUND_COUNT;
  const isInputDisabled = isPending || isLimitReached;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file === undefined) return;
    triggerHaptic("Light");
    onAddCustomBackground(file);
  };

  return (
    <section aria-labelledby={`${inputId}-title`}>
      <div className="mt-5.5 flex items-center justify-between gap-3">
        <h3 id={`${inputId}-title`} className="text-ink text-sm font-bold">
          {copy.customTitle}
        </h3>
        <span className="text-ink-muted text-xs">
          {format(copy.customLimit, { count: backgrounds.length })}
        </span>
      </div>
      <div
        role="group"
        aria-label={copy.customOptionsLabel}
        className="mt-3 grid grid-cols-4 gap-2.5"
      >
        <label
          htmlFor={inputId}
          aria-disabled={isInputDisabled}
          className={cn(
            "text-ink-muted focus-within:outline-olive-dark flex aspect-square min-w-0 items-center justify-center rounded-xl border border-dashed border-gray-300 transition-colors focus-within:outline-2 focus-within:outline-offset-2",
            isInputDisabled
              ? "cursor-not-allowed bg-gray-50"
              : "cursor-pointer hover:bg-gray-50"
          )}
        >
          <span className="flex flex-col items-center gap-1 text-xs">
            <ImagePlus aria-hidden="true" className="size-5" />
            {copy.addCustom}
          </span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label={copy.addCustom}
          disabled={isInputDisabled}
          className="sr-only"
          onChange={handleFileChange}
        />
        {backgrounds.map((background, index) => {
          const isSelected = background.backgroundKey === selectedBackgroundKey;
          return (
            <CookingRecordCustomBackgroundOption
              key={background.backgroundKey}
              background={background}
              index={index}
              isSelected={isSelected}
              isPending={isPending}
              optionLabel={copy.optionLabel}
              onSelect={onSelectBackground}
            />
          );
        })}
      </div>
      {isPending ? (
        <p role="status" className="text-ink-muted mt-3 text-xs">
          {statusMessage ?? copy.addingCustom}
        </p>
      ) : null}
      {errorMessage ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
          {retryLabel && onRetryRegistration ? (
            <button
              type="button"
              onClick={onRetryRegistration}
              className="text-ink focus-visible:outline-olive-dark min-h-11 shrink-0 cursor-pointer rounded-xl px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {retryLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
