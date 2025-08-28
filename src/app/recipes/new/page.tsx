"use client";

import React from "react";
import { FormProvider } from "react-hook-form";

import { useRecipeCreationForm } from "@/features/recipe-create/model/hooks/useRecipeCreationForm";
import RecipeFormLayout from "@/features/recipe-create/ui/RecipeFormLayout";

const NewRecipePage = () => {
  const {
    methods,
    onSubmit,
    handleMainIngredientRemoved,
    isLoading,
    recipeCreationError,
  } = useRecipeCreationForm();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <FormProvider {...methods}>
        <RecipeFormLayout
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
