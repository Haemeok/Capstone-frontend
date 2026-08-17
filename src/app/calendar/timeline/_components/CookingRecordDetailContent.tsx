"use client";

import { type ChangeEvent, useId } from "react";

import { ChevronRight, ImageIcon, Pencil } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n/LocalizedLink";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import { CookingRecordReviewForm } from "./CookingRecordReviewForm";
import type {
  CookingRecordDetail,
  CookingRecordDetailCopy,
} from "./cookingRecordUi.types";

type CookingRecordDetailContentProps = {
  mode: "view" | "review-edit";
  detail: CookingRecordDetail;
  copy: CookingRecordDetailCopy;
  reviewDraft: string;
  isReviewSaving: boolean;
  isPhotoReplacing: boolean;
  onReviewDraftChange: (review: string) => void;
  onStartReviewEdit: () => void;
  onSaveReview: (review: string) => void;
  onPhotoChange: (file: File) => void;
};

export const CookingRecordDetailContent = ({
  mode,
  detail,
  copy,
  reviewDraft,
  isReviewSaving,
  isPhotoReplacing,
  onReviewDraftChange,
  onStartReviewEdit,
  onSaveReview,
  onPhotoChange,
}: CookingRecordDetailContentProps) => {
  const photoInputId = useId();

  const handleStartReviewEdit = () => {
    triggerHaptic("Light");
    onStartReviewEdit();
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onPhotoChange(file);
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto pb-6">
      <div className="flex h-64 items-center justify-center bg-[#f4f4f0] [background-image:radial-gradient(circle,#d7d8d1_1.15px,transparent_1.25px)] [background-size:15px_15px]">
        <Image
          src={detail.imageUrl}
          alt={detail.imageAlt}
          aspectRatio="1 / 1"
          fit="contain"
          wrapperClassName="h-48 w-64 overflow-visible"
          imgClassName="object-contain drop-shadow-[0_10px_12px_rgb(34_34_34/0.18)]"
        />
      </div>

      <div className="px-5 pt-5">
        <p className="text-ink-muted text-xs">{copy.dishLabel}</p>
        <h3 className="text-ink mt-1.5 text-[22px] leading-7 font-bold tracking-[-0.03em]">
          {detail.title}
        </h3>

        {mode === "review-edit" ? (
          <CookingRecordReviewForm
            label={copy.reviewLabel}
            saveLabel={copy.saveReview}
            value={reviewDraft}
            isSaving={isReviewSaving}
            onChange={onReviewDraftChange}
            onSave={onSaveReview}
          />
        ) : (
          <>
            <p className="text-ink-sub mt-3.5 text-[15px] leading-6.5">
              {detail.review || copy.emptyReview}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
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
              <button
                type="button"
                onClick={handleStartReviewEdit}
                className="text-ink-sub focus-visible:outline-olive-dark flex min-h-12 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-[13px] font-bold transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Pencil aria-hidden="true" className="size-[17px]" />
                {copy.editReview}
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
          </>
        )}
      </div>
    </div>
  );
};
