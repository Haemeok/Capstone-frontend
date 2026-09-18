"use client";

import type { ReactNode } from "react";

import { Image } from "@/shared/ui/image/Image";

import {
  CookingRecordEditForm,
  type CookingRecordEditValues,
} from "./CookingRecordEditForm";

export type CookingRecordDetailContentData = {
  title: string;
  review: string;
  imageUrl: string;
  imageAlt: string;
};

export type CookingRecordDetailContentCopy = {
  dishLabel: string;
  dishNameLabel: string;
  reviewLabel: string;
  titleRequiredError: string;
  titleTooLongError: string;
  reviewTooLongError: string;
  saveError: string;
  emptyReview: string;
};

export type CookingRecordDetailContentProps = {
  mode: "view" | "edit";
  detail: CookingRecordDetailContentData;
  copy: CookingRecordDetailContentCopy;
  isReviewSaving: boolean;
  formId: string;
  photoView?: ReactNode;
  editPhotoField?: ReactNode;
  onSaveRecord: (values: CookingRecordEditValues) => Promise<boolean>;
};

const DefaultCookingRecordPhoto = ({
  detail,
}: {
  detail: CookingRecordDetailContentData;
}) => (
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
);

export const CookingRecordDetailContent = ({
  mode,
  detail,
  copy,
  isReviewSaving,
  formId,
  photoView,
  editPhotoField,
  onSaveRecord,
}: CookingRecordDetailContentProps) => (
  <div
    data-testid="cooking-record-detail-scroll"
    className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-5"
  >
    {photoView === undefined ? (
      <DefaultCookingRecordPhoto detail={detail} />
    ) : (
      photoView
    )}

    <div className="px-5 pt-5">
      {mode === "edit" ? (
        <CookingRecordEditForm
          titleLabel={copy.dishNameLabel}
          reviewLabel={copy.reviewLabel}
          titleRequiredError={copy.titleRequiredError}
          titleTooLongError={copy.titleTooLongError}
          reviewTooLongError={copy.reviewTooLongError}
          saveError={copy.saveError}
          initialValues={{ title: detail.title, review: detail.review }}
          isSaving={isReviewSaving}
          formId={formId}
          photoField={editPhotoField}
          onSave={onSaveRecord}
        />
      ) : (
        <>
          <p className="text-ink-muted text-xs">{copy.dishLabel}</p>
          <h3 className="text-ink mt-1.5 text-[22px] leading-7 font-bold tracking-[-0.03em]">
            {detail.title}
          </h3>
          <p className="text-ink-sub mt-3.5 text-[15px] leading-6.5">
            {detail.review || copy.emptyReview}
          </p>
        </>
      )}
    </div>
  </div>
);
