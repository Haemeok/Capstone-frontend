import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBook, UpdateRecipeBookNameRequest } from "./types";

export const updateRecipeBookName = async (
  bookId: string,
  body: UpdateRecipeBookNameRequest
): Promise<RecipeBook> => {
  return api.patch<RecipeBook>(END_POINTS.RECIPE_BOOK(bookId), body);
};
