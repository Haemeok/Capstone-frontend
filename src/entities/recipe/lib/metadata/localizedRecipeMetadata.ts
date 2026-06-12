import type { Metadata } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import { generateRecipeJsonLd } from "./recipeMetadata";

type LocalizedLocale = Exclude<Locale, "ko">;

const OG_LOCALE: Record<LocalizedLocale, string> = {
  ja: "ja_JP",
  en: "en_US",
};

export const generateLocalizedRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string,
  { locale, translated }: { locale: LocalizedLocale; translated: boolean }
): Metadata => {
  const url = absoluteUrl(`${locale}/recipes/${recipeId}`);
  const description = recipe.description || recipe.title;
  const image = recipe.imageUrl || SEO_CONSTANTS.DEFAULT_IMAGE;
  return {
    title: `${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`,
    description,
    robots: translated
      ? { index: true, follow: true }
      : { index: false, follow: false },
    ...(translated ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: recipe.title,
      description,
      url,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: OG_LOCALE[locale],
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
  locale: LocalizedLocale
) => {
  const base = generateRecipeJsonLd(recipe, recipeId);
  return {
    ...base,
    "@graph": base["@graph"].map((node: GraphNode) =>
      node["@type"] === "Recipe" ? { ...node, inLanguage: locale } : node
    ),
  };
};
