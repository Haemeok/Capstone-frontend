import { useCreateAIRecipeMutation } from "../model/hooks";
import { type AIModel, useAIRecipeStore } from "../model/store";
import type { AIRecommendedRecipeRequest } from "../model/types";

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
    },
    onError: (error) => {
      failGeneration(error.message || "레시피 생성에 실패했습니다.");
    },
  });

  const selectAI = (ai: AIModel) => {
    setSelectedAI(ai);
  };

  const generateRecipe = async (
    data: Omit<AIRecommendedRecipeRequest, "robotType">
  ) => {
    if (!selectedAI) {
      failGeneration("AI가 선택되지 않았습니다.");
      return;
    }

    const requestData: AIRecommendedRecipeRequest = {
      ...data,
      robotType: selectedAI.id,
    };

    startGeneration(selectedAI, requestData);
    createAIRecipe(requestData);
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
