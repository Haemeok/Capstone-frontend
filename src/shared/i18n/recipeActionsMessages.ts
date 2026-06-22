import { recipeActions as en } from "./messages/en/recipeActions";
import { recipeActions as ja } from "./messages/ja/recipeActions";
import { recipeActions as ko } from "./messages/ko/recipeActions";
import type { Locale, RecipeActionsDict } from "./types";

export const recipeActionsMessages: Record<Locale, RecipeActionsDict> = {
  ko,
  ja,
  en,
};
