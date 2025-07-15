import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import { cookingTimeItems } from "@/shared/config/constants/recipe";

import { Recipe } from "@/entities/recipe";

import {
  AIRecommendedRecipe,
  AIRecommendedRecipeRequest,
} from "@/features/recipe-create-ai/model/types";

export const postAIRecommendedRecipe = async (
  aiRequest: AIRecommendedRecipeRequest
) => {
  const source = "AI";
  const robotType = "CLASSIC";
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
      timeout: 10 * 60 * 1000, // AI 요청은 10분 타임아웃
    }
  );

  const recipe = await api.get<Recipe>(END_POINTS.RECIPE(response.recipeId));
  return recipe;
};
