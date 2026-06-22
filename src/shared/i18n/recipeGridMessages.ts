import { recipeGrid as en } from "./messages/en/recipeGrid";
import { recipeGrid as ja } from "./messages/ja/recipeGrid";
import { recipeGrid as ko } from "./messages/ko/recipeGrid";
import type { Locale, RecipeGridDict } from "./types";

export const recipeGridMessages: Record<Locale, RecipeGridDict> = {
  ko,
  ja,
  en,
};
