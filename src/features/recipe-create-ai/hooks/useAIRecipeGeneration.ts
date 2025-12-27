import { queryClient } from "@/shared/lib/queryClient";

import { useCreateAIRecipeMutation } from "../model/hooks";
import { AIRecipeFormValues } from "../model/schema";
import { type AIModel, useAIRecipeStore } from "../model/store";
import { buildIngredientFocusRequest } from "../model/adapters";
import type { AIModelId } from "../model/types";

export const useAIRecipeGeneration = () => {
  const {
    generationState,
    selectedAI,
    generatedRecipeData,
    formData,
    error,
    startGeneration,
    completeGeneration,
    failGeneration,
    setSelectedAI,
    resetStore,
  } = useAIRecipeStore();

  const { createAIRecipe } = useCreateAIRecipeMutation({
    onSuccess: (recipe) => {
      completeGeneration(recipe);
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error) => {
      failGeneration(error.message || "레시피 생성에 실패했습니다.");
    },
  });

  const selectAI = (ai: AIModel) => {
    setSelectedAI(ai);
  };

  const generateRecipe = async (data: AIRecipeFormValues) => {
    if (!selectedAI) {
      failGeneration("AI가 선택되지 않았습니다.");
      return;
    }

    const request = buildIngredientFocusRequest({
      ingredientIds: data.ingredients.map((ing) => ing.id),
      dishType: data.dishType,
      cookingTime: data.cookingTime,
      servings: data.servings,
    });

    startGeneration(selectedAI, request);
    createAIRecipe({
      request,
      concept: selectedAI.id as AIModelId,
    });
  };

  const resetGeneration = () => {
    resetStore();
  };

  return {
    generationState,
    selectedAI,
    generatedRecipeData,
    formData,
    error,

    selectAI,
    generateRecipe,
    resetGeneration,

    isIdle: generationState === "idle",
    isGenerating: generationState === "generating",
    isCompleted: generationState === "completed",
    isError: generationState === "error",
  };
};
