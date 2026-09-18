"use client";

import type { Locale, UserPagesDict } from "@/shared/i18n";
import { recipeDetail as recipeEn } from "@/shared/i18n/messages/en/recipeDetail";
import { recipeDetail as recipeJa } from "@/shared/i18n/messages/ja/recipeDetail";
import { recipeDetail as recipeKo } from "@/shared/i18n/messages/ko/recipeDetail";
import type { RecordPhotoCopy } from "@/shared/i18n/recordPhotoMessages";

import type {
  RecordPhotoCatalogState,
  RecordPhotoDraft,
} from "@/entities/recipe/model/recordPhoto.types";
import { toRecordPhotoView } from "@/entities/recipe/model/recordPhotoView";
import { CookingRecordPhoto } from "@/entities/recipe/ui/CookingRecordPhoto";
import {
  CookingRecordDetailContent,
  CookingRecordEditForm,
} from "@/entities/recipe/ui/record-form";

import { ManualCookingRecordForm } from "@/features/cooking-record-create/ui/ManualCookingRecordForm";
import { RecipeCookingRecordForm } from "@/features/recipe-complete/ui/RecipeCookingRecordForm";

import { previewCatalog } from "../_fixtures/catalog";
import type { PreviewRecord } from "../_fixtures/records";
import { PreviewPhotoField } from "./PreviewPhotoField";
import type { PreviewSheetMode } from "./PreviewRecordSheet";

type CookingRecordCopy = UserPagesDict["calendar"]["cookingRecord"];
type PreviewSaveValues = { title: string; review: string; date: string };

type PreviewRecordSheetBodyProps = {
  mode: PreviewSheetMode;
  locale: Locale;
  photo: RecordPhotoDraft;
  catalog: RecordPhotoCatalogState;
  record: PreviewRecord;
  copy: CookingRecordCopy;
  photoCopy: RecordPhotoCopy;
  isPhotoPending: boolean;
  onPhoto: (photo: RecordPhotoDraft) => void;
  onPhotoPendingChange: (isPending: boolean) => void;
  onRetry: () => void;
  onSave: (values: PreviewSaveValues) => void;
};

type PreviewModeContentProps = Omit<PreviewRecordSheetBodyProps, "mode">;

const PreviewCreateForm = ({
  photo,
  catalog,
  record,
  copy,
  photoCopy,
  onPhoto,
  onPhotoPendingChange,
  onRetry,
  onSave,
}: PreviewModeContentProps) => (
  <ManualCookingRecordForm
    formId="preview-create"
    initialCookedDate={record.date}
    copy={copy.create}
    isDisabled={false}
    photoField={(field) => (
      <PreviewPhotoField
        value={photo}
        catalog={catalog}
        copy={photoCopy}
        error={field.error}
        onChange={onPhoto}
        onFile={field.onChange}
        onRetry={onRetry}
        onBusyChange={onPhotoPendingChange}
      />
    )}
    onSubmit={(values) =>
      onSave({
        title: values.title,
        review: values.review,
        date: values.cookedDate,
      })
    }
  />
);

const PreviewEditForm = ({
  photo,
  catalog,
  record,
  copy,
  photoCopy,
  isPhotoPending,
  onPhoto,
  onPhotoPendingChange,
  onRetry,
  onSave,
}: PreviewModeContentProps) => (
  <div className="px-5 pb-6">
    <CookingRecordEditForm
      formId="preview-edit"
      titleLabel={copy.detail.dishNameLabel}
      reviewLabel={copy.detail.reviewLabel}
      titleRequiredError={copy.detail.titleRequiredError}
      titleTooLongError={copy.detail.titleTooLongError}
      reviewTooLongError={copy.detail.reviewTooLongError}
      saveError={copy.detail.saveError}
      initialValues={record}
      isSaving={isPhotoPending}
      photoField={
        <PreviewPhotoField
          value={photo}
          catalog={catalog}
          copy={photoCopy}
          onChange={onPhoto}
          onRetry={onRetry}
          onBusyChange={onPhotoPendingChange}
        />
      }
      onSave={async (values) => {
        onSave({ ...values, date: record.date });
        return true;
      }}
    />
  </div>
);

const PreviewDetail = ({
  record,
  copy,
  photoCopy,
}: PreviewModeContentProps) => (
  <CookingRecordDetailContent
    mode="view"
    detail={{
      ...record,
      imageUrl: record.photo.originalUrl ?? "",
      imageAlt: record.title,
    }}
    copy={copy.detail}
    isReviewSaving={false}
    formId="preview-detail"
    onSaveRecord={async () => false}
    photoView={
      <div className="grid h-64 place-items-center bg-[#f7f7f4]">
        <div className="w-52">
          <CookingRecordPhoto
            view={toRecordPhotoView(record.photo, previewCatalog.plates)}
            alt={record.title}
            emptyLabel={photoCopy.empty}
          />
        </div>
      </div>
    }
  />
);

const PreviewRecipeForm = ({
  locale,
  photo,
  catalog,
  record,
  photoCopy,
  isPhotoPending,
  onPhoto,
  onPhotoPendingChange,
  onRetry,
  onSave,
}: PreviewModeContentProps) => (
  <RecipeCookingRecordForm
    recipeId="preview-recipe"
    recipeTitle={record.title}
    recipeImageUrl={record.photo.originalUrl ?? ""}
    copy={{ ko: recipeKo, en: recipeEn, ja: recipeJa }[locale].cookingRecord}
    isSubmitting={isPhotoPending}
    photoField={(field) => (
      <PreviewPhotoField
        value={photo}
        catalog={catalog}
        copy={photoCopy}
        onChange={onPhoto}
        onFile={field.onChange}
        onRetry={onRetry}
        onBusyChange={onPhotoPendingChange}
      />
    )}
    onSkip={() =>
      onSave({ title: record.title, review: "", date: record.date })
    }
    onSubmit={(values) =>
      onSave({
        title: record.title,
        review: values.review,
        date: record.date,
      })
    }
  />
);

const PreviewSuccess = ({
  photo,
  record,
  copy,
  photoCopy,
}: PreviewModeContentProps) => (
  <div className="px-5 pb-8 text-center">
    <div className="mx-auto w-48">
      <CookingRecordPhoto
        view={toRecordPhotoView(photo, previewCatalog.plates)}
        alt={record.title}
        emptyLabel={photoCopy.empty}
      />
    </div>
    <p className="text-ink-sub mt-3 text-sm">
      {copy.create.successDescription}
    </p>
  </div>
);

export const PreviewRecordSheetBody = (props: PreviewRecordSheetBodyProps) => {
  if (props.mode === "create") return <PreviewCreateForm {...props} />;
  if (props.mode === "edit") return <PreviewEditForm {...props} />;
  if (props.mode === "view") return <PreviewDetail {...props} />;
  if (props.mode === "recipe") return <PreviewRecipeForm {...props} />;
  if (props.mode === "success") return <PreviewSuccess {...props} />;
  return null;
};
