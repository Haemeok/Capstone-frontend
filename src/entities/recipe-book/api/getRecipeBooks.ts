import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBook } from "./types";

export const getRecipeBooks = async (): Promise<RecipeBook[]> => {
  return api.get<RecipeBook[]>(END_POINTS.RECIPE_BOOKS);
};
