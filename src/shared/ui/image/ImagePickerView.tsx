import React from "react";

import { UploadIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { Image } from "./Image";

type Props = {
  className?: string;
  inputId: string;
  previewUrl: string | null;
  errorMessage?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  placeholderText?: string;
  previewAlt?: string;
};

export function ImagePickerView({
  className,
  inputId,
  previewUrl,
  errorMessage,
  inputRef,
  inputProps,
  placeholderText = "이미지 업로드",
  previewAlt = "이미지 미리보기",
}: Props) {
  return (
    <div
      className={cn(
        "relative h-full w-full cursor-pointer bg-gray-200 text-gray-400 hover:bg-gray-300",
        className
      )}
    >
      <label
        htmlFor={inputId}
        className="absolute inset-0 cursor-pointer"
        tabIndex={0}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={previewAlt}
            wrapperClassName="h-full w-full"
            fit="cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <UploadIcon size={48} className="mb-3" />
            <p>{placeholderText}</p>
            {errorMessage && (
              <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
            )}
          </div>
        )}
      </label>

      <input
        id={inputId}
        type="file"
        className="hidden"
        accept="image/*"
        ref={inputRef}
        {...inputProps}
      />
    </div>
  );
}
