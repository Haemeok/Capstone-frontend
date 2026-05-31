import type { RecipeSource, Visibility } from "../model/types";

type VisibilityShape = {
  visibility?: Visibility | null;
};

type SourceShape = {
  source?: RecipeSource | null;
};

export const isPrivateRecipe = (recipe: VisibilityShape): boolean =>
  recipe.visibility === "PRIVATE";

export const isRestrictedRecipe = (recipe: VisibilityShape): boolean =>
  recipe.visibility === "RESTRICTED";

export const isAiRecipe = (recipe: SourceShape): boolean =>
  recipe.source === "AI";

export const isYoutubeRecipe = (recipe: SourceShape): boolean =>
  recipe.source === "YOUTUBE";

export const isUserRecipe = (recipe: SourceShape): boolean =>
  recipe.source === "USER";
