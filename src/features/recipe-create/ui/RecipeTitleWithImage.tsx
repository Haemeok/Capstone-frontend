"use client";

import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { UploadIcon } from "lucide-react";

import { RecipeFormValues } from "@/features/recipe-create/model/config";
import SuspenseImage from "@/shared/ui/image/SuspenseImage";

type RecipeTitleWithImageProps = {
  setImagePreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  imagePreviewUrl: string | null;
  isUpdate?: boolean;
};

const RecipeTitleWithImage = ({
  setImagePreviewUrl,
  imagePreviewUrl,
  isUpdate,
}: RecipeTitleWithImageProps) => {
  const { register, formState, control } = useFormContext<RecipeFormValues>();
  const { errors } = formState;

  const imageFileValue = useWatch({ control, name: "imageFile" });

  const currentTitle = useWatch({
    control,
    name: "title",
  });

  useEffect(() => {
    const fileList = imageFileValue;

    const actualFile = fileList?.[0];

    if (actualFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(actualFile);
    }
  }, [imageFileValue]);

  const imageFileOption = !isUpdate
    ? {
        required: "대표 이미지를 등록해주세요.",
      }
    : {};
  return (
    <div className="relative">
      <div className="relative flex h-[40vh] w-full cursor-pointer items-center justify-center border-b bg-gray-200 text-gray-400 hover:bg-gray-300">
        <label
          htmlFor="imageFile-input"
          className="absolute inset-0 cursor-pointer"
        >
          {imagePreviewUrl ? (
            <SuspenseImage
              src={imagePreviewUrl}
              alt="Recipe thumbnail"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <UploadIcon size={48} className="mb-3" />
              <p>레시피 대표 이미지 업로드</p>
              {errors.imageFile && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.imageFile.message || "이미지 파일은 필수입니다."}
                </p>
              )}
            </div>
          )}
        </label>

        <input
          type="file"
          id="imageFile-input"
          className="hidden"
          accept="image/*"
          {...register("imageFile", imageFileOption)}
        />
      </div>

      <div className="absolute right-0 bottom-0 left-0 flex h-32 flex-col justify-center bg-gradient-to-t from-black/80 to-transparent p-4 pb-8">
        <div className="flex w-7/8 max-w-7/8 items-center justify-between">
          <input
            type="text"
            className={`border-b bg-transparent pb-2 text-4xl font-bold text-white ${
              errors.title ? "border-red-500" : "border-white/30"
            } focus:border-white focus:outline-none`}
            placeholder="레시피 이름"
            {...register("title")}
          />
          <p className="text-sm text-white">{currentTitle.length}/20</p>
        </div>
        {errors.title && (
          <p className="mt-1 text-xs text-red-300">{errors.title.message}</p>
        )}
      </div>
    </div>
  );
};

export default RecipeTitleWithImage;
