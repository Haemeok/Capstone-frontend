"use client";

import { type FormEvent, useId, useState } from "react";

import {
  MAX_RECORD_TEXT_LENGTH,
  MAX_RECORD_TITLE_LENGTH,
} from "@/entities/recipe";

import { CookingRecordTextField } from "./CookingRecordTextField";
import type { CookingRecordEditValues } from "./cookingRecordUi.types";

type CookingRecordEditFormProps = {
  formId: string;
  titleLabel: string;
  reviewLabel: string;
  titleRequiredError: string;
  titleTooLongError: string;
  reviewTooLongError: string;
  saveError: string;
  initialValues: CookingRecordEditValues;
  isSaving: boolean;
  onSave: (values: CookingRecordEditValues) => Promise<boolean>;
};

type FieldErrors = Partial<Record<keyof CookingRecordEditValues, string>>;

export const CookingRecordEditForm = ({
  formId,
  titleLabel,
  reviewLabel,
  titleRequiredError,
  titleTooLongError,
  reviewTooLongError,
  saveError,
  initialValues,
  isSaving,
  onSave,
}: CookingRecordEditFormProps) => {
  const titleInputId = useId();
  const titleErrorId = useId();
  const reviewInputId = useId();
  const reviewErrorId = useId();
  const [title, setTitle] = useState(initialValues.title);
  const [review, setReview] = useState(initialValues.review);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const errors: FieldErrors = {};
    if (title.trim().length === 0) {
      errors.title = titleRequiredError;
    } else if (title.length > MAX_RECORD_TITLE_LENGTH) {
      errors.title = titleTooLongError;
    }
    if (review.length > MAX_RECORD_TEXT_LENGTH) {
      errors.review = reviewTooLongError;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const didSave = await onSave({
      title: title.trim(),
      review: review.trim(),
    });
    if (!didSave) setSubmitError(saveError);
  };

  return (
    <form
      id={formId}
      aria-busy={isSaving}
      onSubmit={(event) => void handleSubmit(event)}
      className="space-y-5"
    >
      <CookingRecordTextField
        id={titleInputId}
        errorId={titleErrorId}
        label={titleLabel}
        value={title}
        maxLength={MAX_RECORD_TITLE_LENGTH}
        error={fieldErrors.title}
        isDisabled={isSaving}
        onChange={(value) => {
          setTitle(value);
          setFieldErrors((current) => ({ ...current, title: undefined }));
          setSubmitError("");
        }}
      />

      <CookingRecordTextField
        id={reviewInputId}
        errorId={reviewErrorId}
        label={reviewLabel}
        value={review}
        maxLength={MAX_RECORD_TEXT_LENGTH}
        error={fieldErrors.review}
        isDisabled={isSaving}
        multiline
        onChange={(value) => {
          setReview(value);
          setFieldErrors((current) => ({ ...current, review: undefined }));
          setSubmitError("");
        }}
      />

      {submitError ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700"
        >
          {submitError}
        </p>
      ) : null}
    </form>
  );
};
