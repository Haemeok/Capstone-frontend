"use client";

import { useForm, useWatch } from "react-hook-form";

import { triggerHaptic } from "@/shared/lib/bridge";

import type {
  RecipeCookingRecordCopy,
  RecipeCookingRecordFormDraft,
} from "./recipeCookingRecord.types";
import {
  RecipeCookingRecordPhotoField,
  RecipeCookingRecordPublishField,
} from "./RecipeCookingRecordFields";

type FormValues = {
  review: string;
  isPublic: boolean;
  imageFile?: File;
};

type RecipeCookingRecordFormProps = {
  recipeId: string;
  recipeTitle: string;
  recipeImageUrl: string;
  copy: RecipeCookingRecordCopy;
  isSubmitting: boolean;
  errorMessage?: string;
  onSubmit: (draft: RecipeCookingRecordFormDraft) => void;
  onSkip: () => void;
};

export const RecipeCookingRecordForm = ({
  recipeId,
  recipeTitle,
  recipeImageUrl,
  copy,
  isSubmitting,
  errorMessage,
  onSubmit,
  onSkip,
}: RecipeCookingRecordFormProps) => {
  const { register, handleSubmit, setValue, control } = useForm<FormValues>({
    defaultValues: { review: "", isPublic: true },
  });
  const imageFile = useWatch({ control, name: "imageFile" });
  const isPublic = useWatch({ control, name: "isPublic" });

  const handleValidSubmit = (values: FormValues) => {
    triggerHaptic("Medium");
    onSubmit({ recipeId, ...values });
  };

  return (
    <form
      aria-labelledby="cooking-record-form-title"
      onSubmit={handleSubmit(handleValidSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div
        data-testid="cooking-record-scroll-region"
        className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-6"
      >
        <div className="space-y-6">
          <div className="pr-12">
            <h2
              id="cooking-record-form-title"
              className="text-ink text-[23px] font-bold tracking-[-0.035em]"
            >
              {copy.formTitle}
            </h2>
            <p className="text-ink-sub mt-1.5 text-sm leading-6">
              {recipeTitle} · {copy.formDescription}
            </p>
          </div>

          <RecipeCookingRecordPhotoField
            recipeTitle={recipeTitle}
            recipeImageUrl={recipeImageUrl}
            imageFile={imageFile}
            copy={copy}
            onChange={(file) =>
              setValue("imageFile", file, { shouldDirty: true })
            }
          />

          <label className="block text-sm font-semibold">
            {copy.reviewLabel}
            <textarea
              {...register("review")}
              maxLength={500}
              placeholder={copy.reviewPlaceholder}
              className="text-ink placeholder:text-ink-disabled focus:border-olive-light mt-2 min-h-28 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 font-normal focus:outline-none"
            />
          </label>

          <RecipeCookingRecordPublishField
            isPublic={isPublic}
            copy={copy}
            onChange={() =>
              setValue("isPublic", !isPublic, { shouldDirty: true })
            }
          />

          {errorMessage ? (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>

      <div
        data-testid="cooking-record-actions"
        className="grid shrink-0 grid-cols-[0.78fr_1.55fr] gap-2 bg-white px-5 pt-2 pb-[max(4px,env(safe-area-inset-bottom))]"
      >
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            onSkip();
          }}
          disabled={isSubmitting}
          className="h-12 cursor-pointer rounded-xl bg-gray-100 text-sm font-semibold disabled:cursor-not-allowed"
        >
          {copy.skip}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-olive-light disabled:text-ink-disabled h-12 cursor-pointer rounded-xl text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {isSubmitting ? copy.submitting : copy.submit}
        </button>
      </div>
    </form>
  );
};
