import type { Visibility } from "../model/types";

type VisibilityShape = {
  visibility?: Visibility | null;
};

export const isPrivateRecipe = (recipe: VisibilityShape): boolean =>
  recipe.visibility === "PRIVATE";

export const isRestrictedRecipe = (recipe: VisibilityShape): boolean =>
  recipe.visibility === "RESTRICTED";
