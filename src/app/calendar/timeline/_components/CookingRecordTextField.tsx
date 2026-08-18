"use client";

import type { ChangeEvent } from "react";

type CookingRecordTextFieldProps = {
  id: string;
  errorId: string;
  label: string;
  value: string;
  maxLength: number;
  error?: string;
  isDisabled: boolean;
  multiline?: boolean;
  onChange: (value: string) => void;
};

export const CookingRecordTextField = ({
  id,
  errorId,
  label,
  value,
  maxLength,
  error,
  isDisabled,
  multiline = false,
  onChange,
}: CookingRecordTextFieldProps) => {
  const countClassName =
    value.length > maxLength ? "text-red-600" : "text-ink-muted";
  const fieldProps = {
    id,
    value,
    disabled: isDisabled,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errorId : undefined,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };

  return (
    <div>
      <label htmlFor={id} className="block">
        <span className="flex items-center justify-between gap-3">
          <span className="text-ink-sub text-xs font-semibold">{label}</span>
          <span aria-hidden className={`text-xs ${countClassName}`}>
            {value.length}/{maxLength}
          </span>
        </span>
        {multiline ? (
          <textarea
            {...fieldProps}
            className="text-ink focus:border-olive-light focus:ring-olive-light mt-2 min-h-28 w-full resize-y rounded-xl border border-gray-200 px-3.5 py-3 text-sm leading-6 font-normal focus:ring-1 focus:outline-none disabled:bg-[#f7f7f5]"
          />
        ) : (
          <input
            {...fieldProps}
            className="text-ink focus:border-olive-light focus:ring-olive-light mt-2 h-12 w-full rounded-xl border border-gray-200 px-3.5 text-sm font-normal focus:ring-1 focus:outline-none disabled:bg-[#f7f7f5]"
          />
        )}
      </label>
      {error ? (
        <span
          id={errorId}
          role="alert"
          className="mt-1.5 block text-xs text-red-600"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
};
