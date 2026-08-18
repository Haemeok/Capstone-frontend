"use client";

import { useId } from "react";

import { Camera } from "lucide-react";

import { useImagePreview } from "@/shared/hooks/useImagePreview";
import { triggerHaptic } from "@/shared/lib/bridge";
import { Image } from "@/shared/ui/image/Image";

import type { RecipeCookingRecordCopy } from "./recipeCookingRecord.types";

type PhotoFieldProps = {
  recipeTitle: string;
  recipeImageUrl: string;
  imageFile?: File;
  copy: RecipeCookingRecordCopy;
  onChange: (file: File) => void;
};

export const RecipeCookingRecordPhotoField = ({
  recipeTitle,
  recipeImageUrl,
  imageFile,
  copy,
  onChange,
}: PhotoFieldProps) => {
  const inputId = useId();
  const previewUrl = useImagePreview(imageFile ?? recipeImageUrl);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file === undefined) return;
    triggerHaptic("Light");
    onChange(file);
  };

  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-center justify-between text-sm font-semibold">
        <span>{copy.photoLabel}</span>
        <span className="text-ink-muted text-xs font-normal">
          {copy.photoOptional}
        </span>
      </legend>
      <label htmlFor={inputId} className="block w-[184px] cursor-pointer">
        <span className="relative block size-[184px] overflow-hidden rounded-2xl bg-gray-100">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={recipeTitle}
              wrapperClassName="size-full"
              fit="cover"
            />
          ) : null}
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/45 px-3 py-2 text-xs text-white">
            <span>{imageFile ? copy.addPhoto : copy.defaultPhoto}</span>
            <Camera className="size-4" aria-hidden="true" />
          </span>
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
      />
    </fieldset>
  );
};

type PublishFieldProps = {
  isPublic: boolean;
  copy: RecipeCookingRecordCopy;
  onChange: () => void;
};

export const RecipeCookingRecordPublishField = ({
  isPublic,
  copy,
  onChange,
}: PublishFieldProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={isPublic}
    onClick={() => {
      triggerHaptic("Light");
      onChange();
    }}
    className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 text-left"
  >
    <span>
      <strong className="text-sm">{copy.publishLabel}</strong>
      <span className="text-ink-muted mt-1 block text-xs">
        {copy.publishDescription}
      </span>
    </span>
    <span
      className={`h-6 w-11 rounded-full p-0.5 transition-colors ${isPublic ? "bg-olive-light" : "bg-gray-300"}`}
    >
      <span
        className={`block size-5 rounded-full bg-white transition-transform ${isPublic ? "translate-x-5" : "translate-x-0"}`}
      />
    </span>
  </button>
);
