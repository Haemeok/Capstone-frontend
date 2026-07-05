import type { TranslatedLocale } from "@/shared/i18n";

export type RecipeSearchBaseKey = readonly [
  "recipes",
  string | null,
  string | null,
  string,
  string,
  string,
  string,
  string,
  string,
];

export type RecipeSearchKeyInput = {
  dishTypeCode: string | null;
  sortCode: string | null;
  tagCodes: string[];
  q: string;
  nutritionQueryParams: Record<string, number>;
  types: string[];
  ingredientIds: string[];
  creatorCountryTags: string[];
};

export const buildRecipeSearchBaseKey = (
  input: RecipeSearchKeyInput
): RecipeSearchBaseKey => [
  "recipes",
  input.dishTypeCode,
  input.sortCode,
  input.tagCodes.join(","),
  input.q,
  JSON.stringify(input.nutritionQueryParams),
  input.types.join(","),
  input.ingredientIds.join(","),
  input.creatorCountryTags.join(","),
];

export const buildSearchQueryKey = (
  base: RecipeSearchBaseKey,
  locale: "ko" | "ja" | "en"
): RecipeSearchBaseKey | readonly [...RecipeSearchBaseKey, TranslatedLocale] =>
  locale === "ko" ? base : ([...base, locale] as const);
