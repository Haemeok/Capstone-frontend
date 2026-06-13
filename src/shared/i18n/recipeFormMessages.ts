import { recipeForm as en } from "./messages/en/recipeForm";
import { recipeForm as ja } from "./messages/ja/recipeForm";
import { recipeForm as ko } from "./messages/ko/recipeForm";
import type { Locale, RecipeFormDict } from "./types";

export const recipeFormMessages: Record<Locale, RecipeFormDict> = {
  ko,
  ja,
  en,
};
