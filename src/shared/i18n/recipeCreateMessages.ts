import { recipeCreate as en } from "./messages/en/recipeCreate";
import { recipeCreate as ja } from "./messages/ja/recipeCreate";
import { recipeCreate as ko } from "./messages/ko/recipeCreate";
import type { Locale, RecipeCreateDict } from "./types";

export const recipeCreateMessages: Record<Locale, RecipeCreateDict> = {
  ko,
  ja,
  en,
};
