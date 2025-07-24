import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import { cookingTimeItems } from "@/shared/config/constants/recipe";

import {
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
} from "@/features/recipe-create-ai/model/types";

export const postAIRecommendedRecipe = async (
  aiRequest: AIRecommendedRecipeRequest
): Promise<AIRecommendedRecipe> => {
  const source = "AI";
  const robotType = aiRequest.robotType;
  const parsedAiRequest = {
    ...aiRequest,
    cookingTime: cookingTimeItems.find(
      (opt: { label: string; value: number }) =>
        opt.label === aiRequest.cookingTime
    )?.value,
  };

  const response = await api.post<AIRecommendedRecipe>(
    END_POINTS.RECIPES,
    {
      aiRequest: parsedAiRequest,
    },
    {
      params: {
        source,
        robotType,
      },
      timeout: 10 * 60 * 1000,
    }
  );

  return response;
};
