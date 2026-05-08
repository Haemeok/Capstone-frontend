import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { Visibility } from "@/entities/recipe/model/types";

export const patchRecipeVisibility = async (
  recipeId: string,
  visibility: Visibility
) => {
  const response = await api.patch(END_POINTS.RECIPE_VISIBILITY(recipeId), {
    visibility,
  });
  return response;
};
