import type { RawRecipeResponse, Recipe } from "../types";

export const recipeDetailReviewFieldTypeGate = (
  recipe: Recipe,
  raw: RawRecipeResponse
): [number, boolean | null, number, boolean | null] => [
  recipe.reviewCount,
  recipe.hasMyReview,
  raw.reviewCount,
  raw.hasMyReview,
];
