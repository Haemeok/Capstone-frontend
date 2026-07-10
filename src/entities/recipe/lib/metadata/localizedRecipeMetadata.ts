import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { TranslatedLocale } from "@/shared/i18n";
import { buildHreflangAlternates } from "@/shared/i18n/hreflang";
import {
  alternateLocales,
  localizedSiteName,
  OG_LOCALE,
} from "@/shared/lib/metadata/localized";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import { generateRecipeJsonLd } from "./recipeMetadata";

export const generateLocalizedRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string,
  { locale, translated }: { locale: TranslatedLocale; translated: boolean }
): Metadata => {
  const url = absoluteUrl(`${locale}/recipes/${recipeId}`);
  const description = recipe.description || recipe.title;
  const image = recipe.imageUrl || SEO_CONSTANTS.DEFAULT_IMAGE;
  const siteName = localizedSiteName(locale);
  const canIndex = translated && recipe.isIndexed === true;
  return {
    title: `${recipe.title} | ${siteName}`,
    description,
    robots: { index: canIndex, follow: translated },
    ...(canIndex
      ? {
          alternates: {
            canonical: url,
            languages: buildHreflangAlternates(`recipes/${recipeId}`),
          },
        }
      : {}),
    openGraph: {
      title: recipe.title,
      description,
      url,
      siteName,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: OG_LOCALE[locale],
      alternateLocale: alternateLocales(locale),
      images: [{ url: image, width: 1200, height: 630, alt: recipe.title }],
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: recipe.title,
      description,
      images: [image],
    },
  };
};

type GraphNode = { "@type"?: string } & Record<string, unknown>;

export const generateLocalizedRecipeJsonLd = (
  recipe: StaticRecipe,
  recipeId: string,
  locale: TranslatedLocale
) => {
  const base = generateRecipeJsonLd(recipe, recipeId, locale);
  return {
    ...base,
    "@graph": base["@graph"].map((node: GraphNode) =>
      node["@type"] === "Recipe" ? { ...node, inLanguage: locale } : node
    ),
  };
};
