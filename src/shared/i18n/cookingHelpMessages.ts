import { cookingHelp as en } from "./messages/en/cookingHelp";
import { cookingHelp as ja } from "./messages/ja/cookingHelp";
import { cookingHelp as ko } from "./messages/ko/cookingHelp";
import type { CookingHelpDict, Locale } from "./types";

export const cookingHelpMessages: Record<Locale, CookingHelpDict> = {
  ko,
  ja,
  en,
};
