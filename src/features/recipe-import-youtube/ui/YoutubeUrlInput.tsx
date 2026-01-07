"use client";

import { useState, ClipboardEvent, ChangeEvent, useEffect } from "react";
import { validateYoutubeUrl } from "../lib/urlValidation";

type YoutubeUrlInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onValidUrl: (cleanUrl: string, videoId: string) => void;
};

export const YoutubeUrlInput = ({
  value,
  onChange: externalOnChange,
  onValidUrl,
}: YoutubeUrlInputProps) => {
  const handleValidation = (url: string) => {
    const result = validateYoutubeUrl(url);

    if (result.valid) {
      onValidUrl(result.cleanUrl, result.videoId);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (externalOnChange) {
      externalOnChange(pastedText);
    }
    handleValidation(pastedText);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (externalOnChange) {
      externalOnChange(value);
    }
  };

  const handleConfirm = () => {
    const trimmed = value?.trim();
    if (trimmed) {
      handleValidation(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder="유튜브 링크를 붙여넣으세요"
          className="${ flex-1 rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
        />
        <button
          onClick={handleConfirm}
          className="bg-olive-medium hover:bg-olive rounded-lg px-6 py-3 font-medium whitespace-nowrap text-white transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
};
