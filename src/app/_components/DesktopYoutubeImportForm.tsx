"use client";

import type { ClipboardEvent } from "react";

import { Link2 } from "lucide-react";

import type { HomeDict } from "@/shared/i18n";

type DesktopYoutubeImportFormProps = {
  messages: HomeDict["desktopYoutubeImport"];
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onPaste: (value: string) => void;
  onFocus: () => void;
};

export const DesktopYoutubeImportForm = ({
  messages,
  value,
  error,
  onChange,
  onPaste,
  onFocus,
}: DesktopYoutubeImportFormProps) => {
  const helperId = "desktop-youtube-import-helper";

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pastedValue = event.clipboardData.getData("text");

    if (!pastedValue) return;

    event.preventDefault();
    onPaste(pastedValue);
  };

  return (
    <div className="mt-7">
      <div
        className={`flex min-h-[60px] items-center gap-3 rounded-2xl border bg-white px-4 transition-colors focus-within:ring-2 ${
          error
            ? "border-red-500 focus-within:ring-red-500/20"
            : "focus-within:ring-olive-light/25 focus-within:border-olive-light border-gray-200"
        }`}
      >
        <Link2 aria-hidden="true" className="text-ink-muted h-5 w-5 shrink-0" />
        <input
          type="url"
          inputMode="url"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onPaste={handlePaste}
          onFocus={onFocus}
          aria-label={messages.inputLabel}
          aria-describedby={helperId}
          aria-invalid={Boolean(error)}
          placeholder={messages.placeholder}
          className="text-ink placeholder:text-ink-muted min-w-0 flex-1 bg-transparent text-[15px] outline-none"
        />
      </div>
      <p
        id={helperId}
        role={error ? "alert" : undefined}
        className={`mt-2 px-1 text-xs ${
          error ? "text-red-500" : "text-ink-muted"
        }`}
      >
        {error ?? messages.helper}
      </p>
    </div>
  );
};
