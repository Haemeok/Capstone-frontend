import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import type { BookRecipe } from "../api/types";

export const toDetailedGridItem = (
  recipe: BookRecipe
): DetailedRecipeGridItem => ({
  ...recipe,
  id: recipe.recipeId,
  avgRating: 0,
  ratingCount: 0,
  favoriteByCurrentUser: false,
});
