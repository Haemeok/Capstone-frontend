"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ImageUploader } from "@/shared/ui/image/ImageUploader";

import { RecipeFormValues } from "@/features/recipe-create/model/config";

const RecipeTitleWithImage = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();
  const currentTitle = useWatch({
    control,
    name: "title",
    defaultValue: "",
  });

  return (
    <div className="relative">
      <div className="relative flex h-[40vh] w-full cursor-pointer items-center justify-center border-b bg-gray-200 text-gray-400 hover:bg-gray-300">
        <ImageUploader fieldName="image" />
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
