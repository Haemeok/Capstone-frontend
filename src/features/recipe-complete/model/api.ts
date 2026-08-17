import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  RecipeCookingRecordCreateInput,
  RecipeRecordResponse,
} from "@/entities/recipe/model/record";
import {
  validateRecordText,
  validateRecordTitle,
} from "@/entities/recipe/model/recordValidation";

export const createRecipeRecord = async (
  input: string | RecipeCookingRecordCreateInput
): Promise<RecipeRecordResponse> => {
  if (typeof input === "string") {
    return api.post<RecipeRecordResponse>(END_POINTS.MY_RECORDS, null, {
      params: { recipeId: input },
    });
  }
  validateRecordTitle(input.recordTitle, false);
  validateRecordText(input.recordMemo);
  validateRecordText(input.reviewContent);
  const { sourceType: _sourceType, recipeId, ...request } = input;
  const response = await api.post<RecipeRecordResponse>(
    END_POINTS.MY_RECORDS,
    request,
    {
      params: { recipeId },
    }
  );
  return response;
};
