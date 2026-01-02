import { api } from "@/shared/api/client";

import { RecipeRecordResponse } from "@/entities/recipe/model/record";

export const createRecipeRecord = async (
  recipeId: string
): Promise<RecipeRecordResponse> => {
  const response = await api.post<RecipeRecordResponse>(
    `/me/records?recipeId=${recipeId}`
  );
  return response;
};
