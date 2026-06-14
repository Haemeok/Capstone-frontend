import { ingredientAdd as en } from "./messages/en/ingredientAdd";
import { ingredientAdd as ja } from "./messages/ja/ingredientAdd";
import { ingredientAdd as ko } from "./messages/ko/ingredientAdd";
import type { IngredientAddDict, Locale } from "./types";

export const ingredientAddMessages: Record<Locale, IngredientAddDict> = {
  ko,
  ja,
  en,
};
