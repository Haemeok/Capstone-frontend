import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { SavedBooksResponse } from "./types";

export const getSavedBooks = async (
  recipeId: string
): Promise<SavedBooksResponse> => {
  return api.get<SavedBooksResponse>(END_POINTS.RECIPE_SAVED_BOOKS(recipeId));
};
