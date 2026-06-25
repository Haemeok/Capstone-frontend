import type { Metadata } from "next";

import type { Locale } from "@/shared/i18n";
import { createIngredientBreadcrumb } from "@/shared/lib/metadata/breadcrumbSchema";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import { localizedPath } from "@/shared/lib/metadata/localized";

import type { DetailedRecipeGridItem } from "@/entities/recipe";

import type {
  IngredientDetailView,
  IngredientNutrition,
} from "../../model/types";

const buildBaseUrl = () =>
  SEO_CONSTANTS.SITE_URL.endsWith("/")
    ? SEO_CONSTANTS.SITE_URL.slice(0, -1)
    : SEO_CONSTANTS.SITE_URL;

const buildTitle = (name: string, recipeCount: number): string => {
  const head =
    recipeCount > 0
      ? `${name} 보관법·효능·레시피 ${recipeCount}가지`
      : `${name} 보관법·효능·손질법`;
  return `${head} | ${SEO_CONSTANTS.SITE_NAME}`;
};

const buildDescription = (
  detail: IngredientDetailView,
  recipeCount: number
): string => {
  const { name, nutrition } = detail;
  const kcal = nutrition?.kcal ?? null;

  const bits: string[] = [];
  if (kcal !== null) bits.push(`100g ${kcal}kcal 영양정보`);
  if (recipeCount > 0) bits.push(`인기 ${name} 레시피 ${recipeCount}가지`);

  const tail = bits.length ? ` ${bits.join(", ")}까지 정리했어요.` : "";
  return `${name} 보관법·효능·손질법·궁합을 한눈에.${tail} ${SEO_CONSTANTS.SITE_NAME}`;
};

const buildOgTitle = (name: string, recipeCount: number): string => {
  const tail = recipeCount > 0 ? `인기 레시피 ${recipeCount}가지` : `손질법`;
  return `${name} 보관법·효능·궁합, ${tail}까지`;
};

const buildOgDescription = (
  detail: IngredientDetailView,
  recipeCount: number
): string => {
  const recipeTail =
    recipeCount > 0
      ? `인기 ${detail.name} 레시피 ${recipeCount}가지까지`
      : `손질법·궁합까지`;
  return `${detail.name} 제대로 쓰는 법 — 보관 꿀팁부터 ${recipeTail} 한눈에.`;
};

export const generateIngredientMetadata = (
  detail: IngredientDetailView,
  recipeCount: number
): Metadata => {
  const baseUrl = buildBaseUrl();
  const fullPageUrl = `${baseUrl}/ingredients/${detail.id}`;

  const title = buildTitle(detail.name, recipeCount);
  const description = buildDescription(detail, recipeCount);
  const ogTitle = buildOgTitle(detail.name, recipeCount);
  const ogDescription = buildOgDescription(detail, recipeCount);

  const imageUrl = detail.imageUrl ?? SEO_CONSTANTS.DEFAULT_IMAGE;
  const ogImages = [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: `${detail.name} - ${SEO_CONSTANTS.SITE_NAME}`,
    },
  ];

  return {
    title,
    description,
    alternates: {
      canonical: fullPageUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: fullPageUrl,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: SEO_CONSTANTS.LOCALE,
      images: ogImages,
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: ogTitle,
      description: ogDescription,
      images: [imageUrl],
    },
  };
};

const buildNutritionProperties = (nutrition: IngredientNutrition) => {
  const props: Array<{ name: string; value: number; unitText: string }> = [
    { name: "Calories", value: nutrition.kcal, unitText: "kcal" },
    { name: "Protein", value: nutrition.proteinG, unitText: "g" },
    { name: "Carbohydrates", value: nutrition.carbohydrateG, unitText: "g" },
    { name: "Fat", value: nutrition.fatG, unitText: "g" },
  ];
  if (nutrition.sugarG != null)
    props.push({ name: "Sugars", value: nutrition.sugarG, unitText: "g" });
  if (nutrition.sodiumMg != null)
    props.push({ name: "Sodium", value: nutrition.sodiumMg, unitText: "mg" });
  return props.map((p) => ({
    "@type": "PropertyValue",
    name: p.name,
    value: p.value,
    unitText: p.unitText,
  }));
};

const createIngredientWebPage = (
  detail: IngredientDetailView,
  locale: Locale
) => {
  const baseUrl = buildBaseUrl();
  const url = `${baseUrl}/${localizedPath(locale, `ingredients/${detail.id}`)}`;
  return {
    "@type": "WebPage",
    name: detail.name,
    url,
    inLanguage: locale,
    ...(detail.imageUrl ? { primaryImageOfPage: detail.imageUrl } : {}),
    about: {
      "@type": "Thing",
      name: detail.name,
      ...(detail.nutrition
        ? { additionalProperty: buildNutritionProperties(detail.nutrition) }
        : {}),
    },
  };
};

const POPULAR_RECIPES_NAME: Record<Locale, (name: string) => string> = {
  ko: (name) => `${name} 인기 레시피`,
  en: (name) => `Popular recipes with ${name}`,
  ja: (name) => `${name}を使った人気レシピ`,
};

const createIngredientItemListStructuredData = (
  detail: IngredientDetailView,
  recipes: DetailedRecipeGridItem[],
  locale: Locale
) => {
  const baseUrl = buildBaseUrl();
  return {
    "@type": "ItemList",
    name: POPULAR_RECIPES_NAME[locale](detail.name),
    inLanguage: locale,
    itemListElement: recipes.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/${localizedPath(locale, `recipes/${recipe.id}`)}`,
      name: recipe.title,
      image: recipe.imageUrl ?? undefined,
    })),
  };
};

export const generateIngredientJsonLd = (
  detail: IngredientDetailView,
  recipes: DetailedRecipeGridItem[],
  locale: Locale = "ko"
) => ({
  "@context": "https://schema.org",
  "@graph": [
    createIngredientWebPage(detail, locale),
    createIngredientBreadcrumb(detail.name, detail.id, locale),
    createIngredientItemListStructuredData(detail, recipes, locale),
  ],
});

export const generateNotFoundIngredientMetadata = (): Metadata => ({
  title: `재료를 찾을 수 없습니다 - ${SEO_CONSTANTS.SITE_NAME}`,
  description: "요청하신 재료를 찾을 수 없습니다.",
});
