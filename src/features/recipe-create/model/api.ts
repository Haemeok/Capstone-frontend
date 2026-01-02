import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { FinalizeRecipeResponse } from "./types";

export const finalizeRecipe = async (recipeId: string) => {
  const response = await api.post<FinalizeRecipeResponse>(
    END_POINTS.RECIPE_FINALIZE(recipeId)
  );
  return response;
};

export const postRecipeReactions = async (
  recipeId: string,
  data: { likeCount: number; ratingCount: number }
) => {
  const response = await api.post(`/test/recipes/${recipeId}/reactions`, data);
  return response;
};
