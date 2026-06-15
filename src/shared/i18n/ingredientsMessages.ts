import { ingredients as en } from "./messages/en/ingredients";
import { ingredients as ja } from "./messages/ja/ingredients";
import { ingredients as ko } from "./messages/ko/ingredients";
import type { IngredientsDict, Locale } from "./types";

export const ingredientsMessages: Record<Locale, IngredientsDict> = {
  ko,
  ja,
  en,
};
