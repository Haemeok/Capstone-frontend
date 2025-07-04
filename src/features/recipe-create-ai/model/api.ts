import { axiosAiInstance } from "@/shared/api/axios";
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

  const response = await axiosAiInstance.post<AIRecommendedRecipe>(
    END_POINTS.RECIPES,
    {
      aiRequest: parsedAiRequest,
    },
    {
      params: {
        source,
        robotType,
      },
    }
  );

  const { data: recipe } = await axiosAiInstance.get<Recipe>(
    END_POINTS.RECIPE(response.data.recipeId),
    {
      useAuth: "optional",
    }
  );
  return recipe;
};
