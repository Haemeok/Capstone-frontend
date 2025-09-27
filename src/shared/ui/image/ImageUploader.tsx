"use client";

import React, { useEffect, useState } from "react";
import { FieldPath, get, useFormContext, useWatch } from "react-hook-form";

import { UploadIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Image } from "@/shared/ui/image/Image";

import { RecipeFormValues } from "@/features/recipe-create/model/config";

type ImageUploaderProps = {
  fieldName: FieldPath<RecipeFormValues>;
  className?: string;
};

export const ImageUploader = ({ fieldName, className }: ImageUploaderProps) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const imageValue = useWatch({ control, name: fieldName });

  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageValue instanceof File) {
      const newUrl = URL.createObjectURL(imageValue);
      setObjectUrl(newUrl);
      return () => URL.revokeObjectURL(newUrl);
    }
  }, [imageValue]);

  const displayUrl = typeof imageValue === "string" ? imageValue : objectUrl;

  const error = get(errors, fieldName);

  const { ref, onChange, ...rest } = register(fieldName);

  return (
    <div
      className={cn(
        "relative w-full h-full cursor-pointer bg-gray-200 text-gray-400 hover:bg-gray-300",
        className
      )}
    >
      <label
        htmlFor={`${fieldName}-input`}
        className="absolute inset-0 cursor-pointer"
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Image preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <UploadIcon size={48} className="mb-3" />
            <p>이미지 업로드</p>
            {error && (
              <p className="mt-1 text-xs text-red-500">
                {error.message || "이미지 파일은 필수입니다."}
              </p>
            )}
          </div>
        )}
      </label>

      <input
        type="file"
        id={`${fieldName}-input`}
        className="hidden"
        accept="image/*"
        {...rest}
        ref={ref}
        onChange={(e) => {
          const file = e.target.files?.[0];

          setValue(fieldName, file || null, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    </div>
  );
};
