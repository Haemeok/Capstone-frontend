import { ingredientPicker as en } from "./messages/en/ingredientPicker";
import { ingredientPicker as ja } from "./messages/ja/ingredientPicker";
import { ingredientPicker as ko } from "./messages/ko/ingredientPicker";
import type { IngredientPickerDict, Locale } from "./types";

export const ingredientPickerMessages: Record<Locale, IngredientPickerDict> = {
  ko,
  ja,
  en,
};
