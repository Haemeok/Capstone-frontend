import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { BookRecipe, RecipeBookDetail, RecipeBookDetailParams } from "./types";

type RawRecipeBookDetail = {
  id: string;
  name: string;
  default: boolean;
  recipeCount: number;
  recipes: BookRecipe[];
  hasNext: boolean;
};

export const getRecipeBookDetail = async (
  bookId: string,
  params: RecipeBookDetailParams = {}
): Promise<RecipeBookDetail> => {
  const { page = 0, size = 20, sort = "addedAt,desc" } = params;
  const { default: isDefault, ...rest } = await api.get<RawRecipeBookDetail>(
    END_POINTS.RECIPE_BOOK(bookId),
    { params: { page, size, sort } }
  );
  return { ...rest, isDefault };
};
