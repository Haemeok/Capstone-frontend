"use client";

import React, { useEffect, useState } from "react";
import { FieldPath, get, useFormContext, useWatch } from "react-hook-form";

import { Trash2, UploadIcon } from "lucide-react";

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

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue(fieldName, null, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setObjectUrl(null);
  };

  return (
    <div
      className={cn(
        "relative w-full aspect-square cursor-pointer bg-gray-200 text-gray-400 hover:bg-gray-300 rounded-lg overflow-hidden",
        className
      )}
    >
      {displayUrl && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute top-2 left-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <Trash2 size={18} />
        </button>
      )}

      <label
        htmlFor={`${fieldName}-input`}
        className="absolute inset-0 cursor-pointer z-10"
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Image preview"
            wrapperClassName="h-full w-full"
            imgClassName="object-cover"
            fit="cover"
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
