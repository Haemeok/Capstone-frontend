import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { RecipeRecordResponse } from "@/entities/recipe/model/record";

export const createRecipeRecord = async (
  recipeId: string
): Promise<RecipeRecordResponse> => {
  const response = await api.post<RecipeRecordResponse>(
    END_POINTS.MY_RECORDS,
    null,
    {
      params: { recipeId },
    }
  );
  return response;
};
