"use client";

import { FormProvider } from "react-hook-form";
import { useParams } from "next/navigation";

import { useRecipeEditForm } from "@/features/recipe-create/model/hooks/useRecipeEditForm";
import RecipeFormLayout from "@/features/recipe-create/ui/RecipeFormLayout";

const UpdateRecipePage = () => {
  const { recipeId } = useParams();

  const {
    methods,
    onSubmit,
    handleMainIngredientRemoved,
    isLoading,
    error,
    ingredientIds,
  } = useRecipeEditForm(Number(recipeId));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <FormProvider {...methods}>
        <RecipeFormLayout
          handleMainIngredientRemoved={handleMainIngredientRemoved}
          isLoading={isLoading}
          recipeCreationError={error}
          onSubmit={onSubmit}
          ingredientIds={ingredientIds}
        />
      </FormProvider>
    </div>
  );
};

export default UpdateRecipePage;
