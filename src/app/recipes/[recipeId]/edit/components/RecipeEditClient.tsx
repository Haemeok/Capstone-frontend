"use client";

import { FormProvider } from "react-hook-form";

import { useRecipeEditForm } from "@/features/recipe-create/model/hooks/useRecipeEditForm";
import RecipeFormLayout from "@/features/recipe-create/ui/RecipeFormLayout";

type RecipeEditClientProps = {
  recipeId: number;
};

const RecipeEditClient = ({ recipeId }: RecipeEditClientProps) => {
  const {
    methods,
    onSubmit,
    handleMainIngredientRemoved,
    isLoading,
    error,
    ingredientIds,
  } = useRecipeEditForm(recipeId);

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

export default RecipeEditClient;
