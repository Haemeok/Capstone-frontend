import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import {
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
} from "@/features/recipe-create-ai/model/types";
import { AIModelId } from "@/shared/config/constants/aiModel";

export const postAIRecommendedRecipe = async (
  aiRequest: AIRecommendedRecipeRequest,
  concept: AIModelId
): Promise<AIRecommendedRecipe> => {

  const response = await api.post<AIRecommendedRecipe>(
    END_POINTS.RECIPE_AI,
    {
      aiRequest,
    },
    {
      params: {
        concept,
      },
      timeout: 10 * 60 * 1000,
    }
  );

  return response;
};
