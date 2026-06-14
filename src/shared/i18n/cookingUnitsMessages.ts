import { cookingUnits as en } from "./messages/en/cookingUnits";
import { cookingUnits as ja } from "./messages/ja/cookingUnits";
import { cookingUnits as ko } from "./messages/ko/cookingUnits";
import type { CookingUnitsDict, Locale } from "./types";

export const cookingUnitsMessages: Record<Locale, CookingUnitsDict> = {
  ko,
  ja,
  en,
};
