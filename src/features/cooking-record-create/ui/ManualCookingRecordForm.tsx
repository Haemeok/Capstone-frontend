"use client";

import { type ComponentType, type ReactNode, useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import type {
  RecordPhotoDraft,
  RecordPhotoEditorProps,
} from "@/entities/recipe/model/recordPhoto.types";
import { createEmptyPhotoDraft } from "@/entities/recipe/model/recordPhotoView";

import type {
  ManualCookingRecordCopy,
  ManualCookingRecordFormValues,
} from "./manualCookingRecord.types";
import { ManualCookingRecordPhotoField } from "./ManualCookingRecordPhotoField";

type FormState = Omit<ManualCookingRecordFormValues, "imageFile"> & {
  imageFile?: File;
};

export type ManualCookingRecordPhotoFieldProps = {
  file: File | undefined;
  onChange: (file: File) => void;
  error?: string;
};

export type ManualCookingRecordFormProps = {
  formId: string;
  initialCookedDate?: string;
  copy: ManualCookingRecordCopy;
  isDisabled: boolean;
  submitError?: string;
  photoField?: (field: ManualCookingRecordPhotoFieldProps) => ReactNode;
  photoEditor?: ComponentType<RecordPhotoEditorProps>;
  onPhotoBusyChange?: (busy: boolean) => void;
  onSubmit: (values: ManualCookingRecordFormValues) => void;
};

const getTodayValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const ManualCookingRecordForm = ({
  formId,
  initialCookedDate,
  copy,
  isDisabled,
  submitError,
  photoField,
  photoEditor: PhotoEditor,
  onPhotoBusyChange,
  onSubmit,
}: ManualCookingRecordFormProps) => {
  const reviewInputId = useId();
  const [photo, setPhoto] = useState(createEmptyPhotoDraft);
  const [isPhotoBusy, setIsPhotoBusy] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: {
      title: "",
      cookedDate: initialCookedDate ?? getTodayValue(),
      review: "",
    },
  });
  const imageFile = useWatch({ control, name: "imageFile" });
  const title = useWatch({ control, name: "title" });

  const handlePhotoChange = (file: File) => {
    setValue("imageFile", file, { shouldDirty: true });
    clearErrors("imageFile");
  };

  const handlePhotoDraftChange = (nextPhoto: RecordPhotoDraft) => {
    setPhoto(nextPhoto);
    if (nextPhoto.originalFile) handlePhotoChange(nextPhoto.originalFile);
  };

  const handlePhotoBusyChange = (busy: boolean) => {
    setIsPhotoBusy(busy);
    onPhotoBusyChange?.(busy);
  };

  const handleValidSubmit = (values: FormState) => {
    if (isPhotoBusy) return;
    if (values.imageFile === undefined) {
      setError("imageFile", { message: copy.photoError });
      return;
    }
    onSubmit({
      ...values,
      imageFile: values.imageFile,
      ...(PhotoEditor ? { photo } : {}),
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleValidSubmit)}
      aria-busy={isDisabled || isPhotoBusy}
      className="min-w-0 px-5 pb-6"
    >
      <fieldset
        disabled={isDisabled}
        className="min-w-0 space-y-5 border-0 p-0"
      >
        {PhotoEditor ? (
          <PhotoEditor
            value={photo}
            onChange={handlePhotoDraftChange}
            disabled={isDisabled}
            error={errors.imageFile?.message}
            onBusyChange={handlePhotoBusyChange}
          />
        ) : photoField ? (
          photoField({
            file: imageFile,
            onChange: handlePhotoChange,
            error: errors.imageFile?.message,
          })
        ) : (
          <ManualCookingRecordPhotoField
            copy={copy}
            file={imageFile}
            title={title}
            error={errors.imageFile?.message}
            onChange={handlePhotoChange}
          />
        )}

        <label className="block text-sm font-semibold">
          {copy.dishTitleLabel}
          <input
            {...register("title", { required: copy.titleError, maxLength: 30 })}
            placeholder={copy.dishTitlePlaceholder}
            className="text-ink placeholder:text-ink-disabled focus:border-olive-light mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 font-normal focus:outline-none"
          />
          {errors.title ? (
            <span className="mt-1.5 block text-xs text-red-600">
              {errors.title.message}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-semibold">
          {copy.cookedDateLabel}
          <input
            {...register("cookedDate", { required: true })}
            type="date"
            max={getTodayValue()}
            className="text-ink focus:border-olive-light mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 font-normal focus:outline-none"
          />
        </label>

        <div>
          <div className="flex items-center justify-between text-sm font-semibold">
            <label htmlFor={reviewInputId}>{copy.reviewLabel}</label>
            <span className="text-ink-muted text-xs font-normal">
              {copy.reviewOptional}
            </span>
          </div>
          <textarea
            id={reviewInputId}
            {...register("review", { maxLength: 500 })}
            placeholder={copy.reviewPlaceholder}
            className="text-ink placeholder:text-ink-disabled focus:border-olive-light mt-2 min-h-24 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 font-normal focus:outline-none"
          />
        </div>
      </fieldset>

      {submitError ? (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600"
        >
          {submitError}
        </p>
      ) : null}
    </form>
  );
};
