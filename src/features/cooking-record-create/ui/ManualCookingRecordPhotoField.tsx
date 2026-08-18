"use client";

import { useId } from "react";

import { Camera } from "lucide-react";

import { useImagePreview } from "@/shared/hooks/useImagePreview";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import type { ManualCookingRecordCopy } from "./manualCookingRecord.types";

type ManualCookingRecordPhotoFieldProps = {
  copy: ManualCookingRecordCopy;
  file?: File;
  title: string;
  error?: string;
  onChange: (file: File) => void;
};

export const ManualCookingRecordPhotoField = ({
  copy,
  file,
  title,
  error,
  onChange,
}: ManualCookingRecordPhotoFieldProps) => {
  const inputId = useId();
  const previewUrl = useImagePreview(file);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (nextFile === undefined) return;
    triggerHaptic("Light");
    onChange(nextFile);
  };

  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-center justify-between text-sm font-semibold">
        <span>{copy.photoLabel}</span>
        <span className="text-ink-muted text-xs font-normal">
          {copy.photoRequired}
        </span>
      </legend>
      <label
        htmlFor={inputId}
        className="relative mx-auto block size-[184px] cursor-pointer overflow-hidden rounded-2xl bg-gray-100"
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={title || copy.photoLabel}
            wrapperClassName="size-full"
            fit="cover"
          />
        ) : (
          <span className="text-ink-muted flex size-full flex-col items-center justify-center gap-2 text-sm">
            <Camera className="size-6" aria-hidden="true" />
            {copy.addPhoto}
          </span>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label={copy.photoLabel}
        className="sr-only"
        onChange={handleChange}
      />
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </fieldset>
  );
};
