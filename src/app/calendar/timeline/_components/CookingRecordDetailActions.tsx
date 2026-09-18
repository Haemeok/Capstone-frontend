"use client";

import { type ChangeEvent, useId } from "react";

import { ChevronRight, ImageIcon, Pencil } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { triggerHaptic } from "@/shared/lib/bridge";

import type {
  CookingRecordDetail,
  CookingRecordDetailCopy,
} from "./cookingRecordUi.types";

type CookingRecordDetailActionsProps = {
  detail: CookingRecordDetail;
  copy: CookingRecordDetailCopy;
  isPhotoReplacing: boolean;
  onStartEdit: () => void;
  onPhotoChange: (file: File) => void;
  onEditPhoto?: () => void;
};

export const CookingRecordDetailActions = ({
  detail,
  copy,
  isPhotoReplacing,
  onStartEdit,
  onPhotoChange,
  onEditPhoto,
}: CookingRecordDetailActionsProps) => {
  const photoInputId = useId();

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onPhotoChange(file);
  };

  return (
    <div
      data-testid="cooking-record-detail-actions"
      className="shrink-0 border-t border-gray-100 bg-white px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-2 gap-2.5">
        {onEditPhoto ? (
          <button
            type="button"
            disabled={isPhotoReplacing}
            onClick={() => {
              triggerHaptic("Light");
              onEditPhoto();
            }}
            className="text-ink-sub flex min-h-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 text-[13px] font-semibold disabled:opacity-50"
          >
            <ImageIcon aria-hidden="true" className="size-[17px]" />
            {copy.changePhoto}
          </button>
        ) : (
          <>
            <label
              htmlFor={photoInputId}
              aria-disabled={isPhotoReplacing}
              className="text-ink-sub focus-within:outline-olive-dark flex min-h-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-[13px] font-bold transition-colors focus-within:outline-2 focus-within:outline-offset-2 hover:bg-gray-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            >
              <ImageIcon aria-hidden="true" className="size-[17px]" />
              {copy.changePhoto}
            </label>
            <input
              id={photoInputId}
              type="file"
              accept="image/*"
              disabled={isPhotoReplacing}
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </>
        )}
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            onStartEdit();
          }}
          className="text-ink-sub focus-visible:outline-olive-dark flex min-h-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-[13px] font-bold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Pencil aria-hidden="true" className="size-[17px]" />
          {copy.editRecord}
        </button>
      </div>

      {detail.recipeHref ? (
        <LocalizedLink
          href={detail.recipeHref}
          className="bg-olive-light active:bg-olive-dark focus-visible:outline-olive-dark mt-2.5 flex min-h-13 cursor-pointer items-center justify-between rounded-[13px] px-4 text-[15px] font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span>{copy.viewRecipe}</span>
          <ChevronRight aria-hidden="true" className="size-[19px]" />
        </LocalizedLink>
      ) : null}
    </div>
  );
};
