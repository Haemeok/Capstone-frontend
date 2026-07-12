import { ingredientDetail as en } from "./messages/en/ingredientDetail";
import { ingredientDetail as ja } from "./messages/ja/ingredientDetail";
import { ingredientDetail as ko } from "./messages/ko/ingredientDetail";
import type { IngredientDetailDict, Locale } from "./types";

export const ingredientDetailMessages: Record<Locale, IngredientDetailDict> = {
  ko,
  ja,
  en,
};
