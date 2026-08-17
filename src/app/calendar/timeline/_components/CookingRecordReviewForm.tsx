"use client";

import { type FormEvent, useId } from "react";

type CookingRecordReviewFormProps = {
  label: string;
  saveLabel: string;
  value: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: (value: string) => void;
};

export const CookingRecordReviewForm = ({
  label,
  saveLabel,
  value,
  isSaving,
  onChange,
  onSave,
}: CookingRecordReviewFormProps) => {
  const inputId = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3.5">
      <label
        htmlFor={inputId}
        className="text-ink-sub mb-2 block text-xs font-bold"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        value={value}
        maxLength={500}
        disabled={isSaving}
        onChange={(event) => onChange(event.target.value)}
        className="text-ink focus:border-olive-light focus:ring-olive-light min-h-28 w-full resize-y rounded-xl border border-gray-200 px-3.5 py-3 text-sm leading-6 focus:ring-1 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSaving}
        className="bg-ink focus-visible:outline-ink mt-2 min-h-11 w-full cursor-pointer rounded-xl text-[13px] font-bold text-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saveLabel}
      </button>
    </form>
  );
};
