"use client";

import { useId } from "react";
import { useForm, useWatch } from "react-hook-form";

import type {
  ManualCookingRecordCopy,
  ManualCookingRecordFormValues,
} from "./manualCookingRecord.types";
import { ManualCookingRecordPhotoField } from "./ManualCookingRecordPhotoField";

type FormState = Omit<ManualCookingRecordFormValues, "imageFile"> & {
  imageFile?: File;
};

type ManualCookingRecordFormProps = {
  formId: string;
  copy: ManualCookingRecordCopy;
  isDisabled: boolean;
  submitError?: string;
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
  copy,
  isDisabled,
  submitError,
  onSubmit,
}: ManualCookingRecordFormProps) => {
  const reviewInputId = useId();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormState>({
    defaultValues: { title: "", cookedDate: getTodayValue(), review: "" },
  });
  const imageFile = useWatch({ control, name: "imageFile" });
  const title = useWatch({ control, name: "title" });

  const handleValidSubmit = (values: FormState) => {
    if (values.imageFile === undefined) {
      setError("imageFile", { message: copy.photoError });
      return;
    }
    onSubmit({ ...values, imageFile: values.imageFile });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleValidSubmit)}
      aria-busy={isDisabled}
      className="px-5 pb-6"
    >
      <fieldset disabled={isDisabled} className="space-y-5 border-0 p-0">
        <ManualCookingRecordPhotoField
          copy={copy}
          file={imageFile}
          title={title}
          error={errors.imageFile?.message}
          onChange={(file) => {
            setValue("imageFile", file, { shouldDirty: true });
            clearErrors("imageFile");
          }}
        />

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
