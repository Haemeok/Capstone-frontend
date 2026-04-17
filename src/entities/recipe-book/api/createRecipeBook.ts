import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { CreateRecipeBookRequest, RecipeBook } from "./types";

export const createRecipeBook = async (
  body: CreateRecipeBookRequest
): Promise<RecipeBook> => {
  return api.post<RecipeBook>(END_POINTS.RECIPE_BOOKS, body);
};
