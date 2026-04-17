import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBookDetail, RecipeBookDetailParams } from "./types";

export const getRecipeBookDetail = async (
  bookId: string,
  params: RecipeBookDetailParams = {}
): Promise<RecipeBookDetail> => {
  const { page = 0, size = 20, sort = "addedAt,desc" } = params;
  return api.get<RecipeBookDetail>(END_POINTS.RECIPE_BOOK(bookId), {
    params: { page, size, sort },
  });
};
