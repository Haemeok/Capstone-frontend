"use client";

import { FormProvider } from "react-hook-form";

import { prepareRecipeData } from "@/features/recipe-create/lib/prepareRecipeData";
import { prepareRemixPayload } from "@/features/recipe-create/lib/prepareRemixPayload";
import { useRecipeRemixForm } from "@/features/recipe-create/model/hooks/useRecipeRemixForm";
import { useSubmitRemix } from "@/features/recipe-create/model/hooks/useSubmitRemix";
import RecipeFormLayout from "@/features/recipe-create/ui/RecipeFormLayout";

type Props = { recipeId: string };

export const RecipeRemixForm = ({ recipeId }: Props) => {
  const { methods, recipe, isRecipeLoaded, handleMainIngredientRemoved } =
    useRecipeRemixForm(recipeId);
  const { submitRemix, isPending, error } = useSubmitRemix();

  if (!isRecipeLoaded || !recipe) return null;

  const onSubmit = methods.handleSubmit(async (formData) => {
    const { recipeData, filesToUploadInfo, fileObjects } =
      await prepareRecipeData(formData);

    const remixPayload = prepareRemixPayload(recipe, recipeId);

    const finalPayload = {
      ...remixPayload,
      ...recipeData,
      originRecipeId: recipeId,
    };

    submitRemix({
      originRecipeId: recipeId,
      recipe: finalPayload,
      fileInfos: filesToUploadInfo,
      fileObjects,
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <FormProvider {...methods}>
        <RecipeFormLayout
          handleMainIngredientRemoved={handleMainIngredientRemoved}
          isLoading={isPending}
          recipeCreationError={error instanceof Error ? error : null}
          onSubmit={onSubmit}
          isEdit={false}
        />
      </FormProvider>
    </div>
  );
};
