import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n/hreflang";

import type { DetailedRecipeGridItem } from "@/entities/recipe";

import type { IngredientDetailView } from "../../model/types";
import { generateIngredientJsonLd } from "./ingredientMetadata";

type LocalizedLocale = Exclude<Locale, "ko">;

const OG_LOCALE: Record<LocalizedLocale, string> = {
  ja: "ja_JP",
  en: "en_US",
};

const buildLocalizedTitle: Record<
  LocalizedLocale,
  (name: string, recipeCount: number) => string
> = {
  en: (name, recipeCount) =>
    recipeCount > 0
      ? `${name}: Storage, Benefits & ${recipeCount} Recipes`
      : `${name}: Storage, Benefits & Nutrition`,
  ja: (name, recipeCount) =>
    recipeCount > 0
      ? `${name}の保存方法・効能・人気レシピ${recipeCount}選`
      : `${name}の保存方法・効能・栄養`,
};

const buildLocalizedDescription: Record<
  LocalizedLocale,
  (name: string, recipeCount: number) => string
> = {
  en: (name, recipeCount) => {
    const recipeTail =
      recipeCount > 0 ? ` and ${recipeCount} popular ${name} recipes` : "";
    return `Storage tips, health benefits and nutrition${recipeTail} — everything about ${name} in one place. Recipio.`;
  },
  ja: (name, recipeCount) => {
    const recipeTail =
      recipeCount > 0 ? `から人気レシピ${recipeCount}選まで` : "・栄養まで";
    return `${name}の保存方法・効能${recipeTail}、まとめてチェック。レシピオ。`;
  },
};

export const generateLocalizedIngredientMetadata = (
  detail: IngredientDetailView,
  recipeCount: number,
  { locale, translated }: { locale: LocalizedLocale; translated: boolean }
): Metadata => {
  const url = absoluteUrl(`${locale}/ingredients/${detail.id}`);
  const title = buildLocalizedTitle[locale](detail.name, recipeCount);
  const description = buildLocalizedDescription[locale](
    detail.name,
    recipeCount
  );
  return {
    title,
    description,
    robots: translated
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(translated
      ? {
          alternates: {
            canonical: url,
            languages: buildHreflangAlternates(`ingredients/${detail.id}`),
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: OG_LOCALE[locale],
    },
  };
};

export const generateLocalizedIngredientJsonLd = (
  detail: IngredientDetailView,
  recipes: DetailedRecipeGridItem[],
  locale: LocalizedLocale
) => generateIngredientJsonLd(detail, recipes, locale);
