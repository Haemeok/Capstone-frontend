"use client";

import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
  DISH_TYPES,
  DISH_TYPES_FOR_CREATE_RECIPE,
} from "@/shared/config/constants/recipe";

import { useToastStore } from "@/widgets/Toast";
import { useRecipeCreationForm } from "@/features/recipe-create/model/hooks/useRecipeCreationForm";
import RecipeFormLayout from "@/features/recipe-create/ui/RecipeFormLayout";

const NewRecipePage = () => {
  const {
    methods,
    onSubmit,
    imagePreviewUrl,
    setImagePreviewUrl,
    handleMainIngredientRemoved,
    isLoading,
    recipeCreationError,
  } = useRecipeCreationForm();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <FormProvider {...methods}>
        <RecipeFormLayout
          imagePreviewUrl={imagePreviewUrl}
          setImagePreviewUrl={setImagePreviewUrl}
          handleMainIngredientRemoved={handleMainIngredientRemoved}
          isLoading={isLoading}
          recipeCreationError={recipeCreationError}
          onSubmit={onSubmit}
        />
      </FormProvider>
    </div>
  );
};

export default NewRecipePage;
