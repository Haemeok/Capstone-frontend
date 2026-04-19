import { CACHE_TAGS } from "./tags";

export type InvalidationEvent =
  | { type: "RECIPE_MUTATED"; recipeId: string }
  | { type: "RECIPE_DELETED"; recipeId: string }
  | { type: "COMMENT_CHANGED"; recipeId: string };

export const getTagsToInvalidate = (event: InvalidationEvent): string[] => {
  switch (event.type) {
    case "RECIPE_MUTATED":
      return [
        CACHE_TAGS.recipe(event.recipeId),
        CACHE_TAGS.recipesPopular,
        CACHE_TAGS.recipesBudget,
        CACHE_TAGS.recipesRecommended(event.recipeId),
        CACHE_TAGS.recipesSitemap,
      ];
    case "RECIPE_DELETED":
      return [
        CACHE_TAGS.recipe(event.recipeId),
        CACHE_TAGS.recipesPopular,
        CACHE_TAGS.recipesBudget,
        CACHE_TAGS.recipesRecommended(event.recipeId),
        CACHE_TAGS.recipesSitemap,
        CACHE_TAGS.recipesTrending,
      ];
    case "COMMENT_CHANGED":
      return [CACHE_TAGS.recipe(event.recipeId)];
  }
};
