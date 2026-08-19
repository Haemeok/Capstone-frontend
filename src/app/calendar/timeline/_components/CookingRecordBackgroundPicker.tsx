"use client";

import type {
  StickerBookBackground,
  StickerBookBackgroundOption,
} from "@/entities/recipe";

import type { CustomBackgroundErrorKind } from "@/features/cooking-record-background";

import { CookingRecordBackgroundOptions } from "./CookingRecordBackgroundOptions";
import { CookingRecordBackgroundPreview } from "./CookingRecordBackgroundPreview";
import { CookingRecordCustomBackgroundSection } from "./CookingRecordCustomBackgroundSection";
import type {
  CookingRecordStickerItem,
  CookingRecordViewSettingsCopy,
} from "./cookingRecordUi.types";

type CookingRecordBackgroundPickerProps = {
  backgrounds: StickerBookBackgroundOption[];
  previewBackground: StickerBookBackground | null;
  selectedBackgroundKey?: string;
  previewRecords: CookingRecordStickerItem[];
  copy: CookingRecordViewSettingsCopy;
  isListPending: boolean;
  isListError: boolean;
  isAddingCustom: boolean;
  isCustomBackgroundProcessing: boolean;
  customBackgroundErrorKind?: CustomBackgroundErrorKind | null;
  isApplying: boolean;
  onSelectBackground: (backgroundKey: string) => void;
  onAddCustomBackground: (file: File) => void;
  onRetryCustomBackground: () => void;
  onRequestDeleteCustomBackground: () => void;
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
  isAddingCustom,
  isCustomBackgroundProcessing,
  customBackgroundErrorKind,
  isApplying,
  onSelectBackground,
  onAddCustomBackground,
  onRetryCustomBackground,
  onRequestDeleteCustomBackground,
  onRetry,
  onApply,
}: CookingRecordBackgroundPickerProps) => {
  const selectedBackground = backgrounds.find(
    (background) => background.backgroundKey === selectedBackgroundKey
  );
  const customErrorMessage = customBackgroundErrorKind
    ? copy.customErrors[customBackgroundErrorKind]
    : undefined;

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-6">
      <p className="text-ink-sub text-sm leading-5.5">{copy.intro}</p>
      <CookingRecordBackgroundPreview
        background={previewBackground}
        records={previewRecords}
        label={copy.previewLabel}
      />

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
        <>
          <CookingRecordCustomBackgroundSection
            backgrounds={backgrounds.filter(
              (background) => background.backgroundType === "CUSTOM"
            )}
            selectedBackgroundKey={selectedBackgroundKey}
            copy={copy}
            isPending={isAddingCustom}
            statusMessage={
              isCustomBackgroundProcessing ? copy.processingCustom : undefined
            }
            errorMessage={customErrorMessage}
            retryLabel={
              customBackgroundErrorKind === "PROCESSING_TIMEOUT"
                ? copy.retryCustom
                : undefined
            }
            onSelectBackground={onSelectBackground}
            onAddCustomBackground={onAddCustomBackground}
            onRetryRegistration={onRetryCustomBackground}
          />
          <CookingRecordBackgroundOptions
            backgrounds={backgrounds.filter(
              (background) => background.backgroundType === "PRESET"
            )}
            selectedBackgroundKey={selectedBackgroundKey}
            copy={copy}
            onSelectBackground={onSelectBackground}
          />
        </>
      )}

      {selectedBackground?.backgroundType === "CUSTOM" ? (
        <button
          type="button"
          disabled={isAddingCustom || isApplying}
          onClick={onRequestDeleteCustomBackground}
          className="focus-visible:outline-olive-dark mt-4 min-h-11 w-full cursor-pointer rounded-xl text-sm font-semibold text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:text-red-300"
        >
          {copy.deleteCustom}
        </button>
      ) : null}

      <button
        type="button"
        disabled={
          !selectedBackgroundKey || isApplying || isAddingCustom || isListError
        }
        onClick={onApply}
        className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark disabled:text-ink-disabled mt-4.5 min-h-12.5 w-full cursor-pointer rounded-[13px] text-[15px] font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        {isApplying ? copy.applying : copy.apply}
      </button>
    </div>
  );
};
