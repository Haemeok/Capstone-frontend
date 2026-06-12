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

export const generateLocalizedIngredientMetadata = (
  detail: IngredientDetailView,
  recipeCount: number,
  { locale, translated }: { locale: LocalizedLocale; translated: boolean }
): Metadata => {
  const url = absoluteUrl(`${locale}/ingredients/${detail.id}`);
  const description = detail.benefits || `${detail.name} (${recipeCount})`;
  return {
    title: detail.name,
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
      title: detail.name,
      description,
      url,
      type: "article",
      locale: OG_LOCALE[locale],
    },
  };
};

type GraphNode = { "@type"?: string } & Record<string, unknown>;

export const generateLocalizedIngredientJsonLd = (
  detail: IngredientDetailView,
  recipes: DetailedRecipeGridItem[],
  locale: LocalizedLocale
) => {
  const base = generateIngredientJsonLd(detail, recipes);
  return {
    ...base,
    "@graph": base["@graph"].map((node: GraphNode) =>
      node["@type"] === "ItemList" ? { ...node, inLanguage: locale } : node
    ),
  };
};
