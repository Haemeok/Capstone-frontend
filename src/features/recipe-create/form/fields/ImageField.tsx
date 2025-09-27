"use client";

import React, { useId } from "react";
import {
  FieldPathByValue,
  useController,
  useFormContext,
} from "react-hook-form";
import { useImagePreview } from "@/shared/hooks/useImagePreview";
import { ImagePickerView } from "@/shared/ui/image/ImagePickerView";
import {
  ImageType,
  RecipeFormValues,
} from "@/features/recipe-create/model/config";

type ImageFieldName = FieldPathByValue<RecipeFormValues, ImageType>;

type Props<TName extends ImageFieldName> = {
  name: TName;
  className?: string;
};

export const ImageField = <TName extends ImageFieldName>({
  name,
  className,
}: Props<TName>) => {
  const { control } = useFormContext<RecipeFormValues>();

  const { field, fieldState } = useController<RecipeFormValues, TName>({
    name,
    control,
    defaultValue: undefined,
    // 필요할 때만 validate 추가
    // rules: { validate: (v) => /* size/MIME 검사 */ true },
  });

  const previewUrl = useImagePreview(field.value);
  const inputId = useId();

  return (
    <ImagePickerView
      className={className}
      inputId={inputId}
      previewUrl={previewUrl}
      errorMessage={fieldState.error && String(fieldState.error.message)}
      inputRef={field.ref}
      inputProps={{
        name: field.name,
        onBlur: field.onBlur,
        onChange: (e) => {
          const file = (e.target as HTMLInputElement).files?.[0] ?? null;
          field.onChange(file);
        },
      }}
    />
  );
};
