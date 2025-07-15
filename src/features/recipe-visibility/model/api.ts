import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postRecipeVisibility = async (recipeId: number) => {
  const response = await api.post(END_POINTS.RECIPE_VISIBILITY(recipeId));
  return response;
};
