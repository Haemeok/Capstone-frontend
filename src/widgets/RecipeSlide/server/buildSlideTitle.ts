import type { Locale } from "@/shared/i18n";
import { format } from "@/shared/i18n";
import { searchDiscoveryMessages } from "@/shared/i18n/searchDiscoveryMessages";

import type {
  CategoryCode,
  CountryPopularCode,
} from "@/entities/recipe/model/types";

import { monthToSeason } from "../SeasonalPopularSlide";

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
