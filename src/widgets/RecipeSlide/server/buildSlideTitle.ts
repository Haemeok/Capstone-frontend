import type { Locale } from "@/shared/i18n";
import { format } from "@/shared/i18n";
import { recipeDetail as enDetail } from "@/shared/i18n/messages/en/recipeDetail";
import { recipeDetail as jaDetail } from "@/shared/i18n/messages/ja/recipeDetail";
import { recipeDetail as koDetail } from "@/shared/i18n/messages/ko/recipeDetail";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import type {
  CategoryCode,
  CountryPopularCode,
} from "@/entities/recipe/model/types";

import { monthToSeason } from "../season";

export const recipeDetailMessages = {
  ko: koDetail,
  ja: jaDetail,
  en: enDetail,
} as const;

export const buildSeasonalTitle = (
  locale: Locale,
  ingredient: string,
  month: number
): string => {
  const t = searchDiscoveryMessages[locale];
  return format(t.seasonalPopularTitle, {
    adjective: t.seasonalAdjectives?.[monthToSeason(month)] ?? "",
    month,
    ingredient,
  });
};

export const buildCountryTitle = (
  locale: Locale,
  code: CountryPopularCode
): string => {
  const t = searchDiscoveryMessages[locale];
  return format(t.countryPopularTitle, {
    country: t.countryPopularNames[code],
  });
};

export const buildQuickTitle = (locale: Locale, minutes: number): string =>
  format(searchDiscoveryMessages[locale].quickPopularTitle, { minutes });

export const buildCategoryTitle = (
  locale: Locale,
  code: CategoryCode
): string => {
  const t = searchDiscoveryMessages[locale];
  return format(t.categoryPopularTitle, {
    category: t.categoryPopularNames[code],
  });
};

export const buildSameIngredientTitle = (
  locale: Locale,
  ingredientName: string
): string =>
  format(recipeDetailMessages[locale].sameIngredientTitle, { ingredientName });

export const buildTitleKeywordTitle = (
  locale: Locale,
  keyword: string
): string =>
  format(recipeDetailMessages[locale].titleKeywordTitle, { keyword });
