import { useRouter } from "next/navigation";

import { useCreateAIRecipeMutation } from "../model/hooks";
import type { AIRecommendedRecipeRequest } from "../model/types";

export const useAIRecipeSubmission = () => {
  const router = useRouter();
  const {
    createAIRecipe,
    isPending,
    isSuccess,
    data: aiRecipeData,
  } = useCreateAIRecipeMutation();

  const submitAIRecipe = (data: AIRecommendedRecipeRequest) => {
    createAIRecipe(data);
  };

  const handleGoToRecipe = () => {
    if (aiRecipeData?.recipeId) {
      router.replace(`/recipes/${aiRecipeData.recipeId}`);
    }
  };

  return {
    isPending,
    isSuccess,
    aiRecipeData,

    submitAIRecipe,
    handleGoToRecipe,
  };
};
