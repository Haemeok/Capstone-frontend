import type { Metadata } from "next";

import { createIngredientBreadcrumb } from "@/shared/lib/metadata/breadcrumbSchema";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

import type { DetailedRecipeGridItem } from "@/entities/recipe";

import type { IngredientDetailView } from "../../model/types";

const buildBaseUrl = () =>
  SEO_CONSTANTS.SITE_URL.endsWith("/")
    ? SEO_CONSTANTS.SITE_URL.slice(0, -1)
    : SEO_CONSTANTS.SITE_URL;

const buildTitle = (name: string, recipeCount: number): string => {
  const recipePart =
    recipeCount > 0 ? `보관법·효능·인기 레시피 ${recipeCount}가지` : "보관법·효능·손질법";
  return `${name} 완벽 가이드: ${recipePart} | ${SEO_CONSTANTS.SITE_NAME}`;
};

const buildDescription = (
  detail: IngredientDetailView,
  recipeCount: number
): string => {
  const { name, pairings, nutrition } = detail;
  const firstBadPair = pairings.bad[0];
  const kcal = nutrition?.calories ?? null;

  if (firstBadPair) {
    const recipeTail =
      recipeCount > 0
        ? `진짜 사람들의 인기 레시피 ${recipeCount}개까지`
        : `손질법·효능·궁합까지`;
    return `${name}, 절대 이렇게 보관하지 마세요!! ${name}+${firstBadPair}? 같이 안 먹는 걸 추천해요. 효능·칼로리·손질법부터 ${recipeTail} — ${SEO_CONSTANTS.SITE_NAME}.`;
  }

  const kcalPart = kcal !== null ? `100g ${kcal}kcal 영양정보, ` : "";
  const recipeTail =
    recipeCount > 0
      ? `진짜 사람들의 인기 ${name} 레시피 ${recipeCount}개까지`
      : `손질법·궁합까지`;
  return `${name}, 절대 이렇게 보관하지 마세요!! 효능을 200% 살리는 손질법, ${kcalPart}그리고 ${recipeTail} — ${SEO_CONSTANTS.SITE_NAME}.`;
};

const buildOgTitle = (name: string, recipeCount: number): string => {
  const tail =
    recipeCount > 0 ? `인기 레시피 ${recipeCount}가지` : `보관법·효능·손질법`;
  return `🧅 ${name}, 진짜 이렇게 쓰는 거였어? — 보관·궁합·${tail}`;
};

const buildOgDescription = (
  detail: IngredientDetailView,
  recipeCount: number
): string => {
  const firstBadPair = detail.pairings.bad[0];
  const recipeTail =
    recipeCount > 0
      ? `인기 레시피 ${recipeCount}개까지`
      : `손질법·궁합까지`;
  if (firstBadPair) {
    return `${detail.name}+${firstBadPair}? 같이 안 먹는 걸 추천해요. 보관 꿀팁부터 ${recipeTail}.`;
  }
  return `${detail.name}, 이렇게 쓰면 다 달라져요. 보관 꿀팁부터 ${recipeTail}.`;
};

const buildKeywords = (name: string): string[] => [
  ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
  name,
  `${name} 보관법`,
  `${name} 효능`,
  `${name} 레시피`,
  `${name} 칼로리`,
  `${name} 손질법`,
  `${name} 영양성분`,
  `${name} 궁합`,
];

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
  const keywords = buildKeywords(detail.name);

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
    keywords,
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

const createIngredientItemListStructuredData = (
  detail: IngredientDetailView,
  recipes: DetailedRecipeGridItem[]
) => {
  const baseUrl = buildBaseUrl();
  return {
    "@type": "ItemList",
    name: `${detail.name} 인기 레시피`,
    itemListElement: recipes.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/recipes/${recipe.id}`,
      name: recipe.title,
      image: recipe.imageUrl ?? undefined,
    })),
  };
};

export const generateIngredientJsonLd = (
  detail: IngredientDetailView,
  recipes: DetailedRecipeGridItem[]
) => ({
  "@context": "https://schema.org",
  "@graph": [
    createIngredientBreadcrumb(detail.name, detail.id),
    createIngredientItemListStructuredData(detail, recipes),
  ],
});

export const generateNotFoundIngredientMetadata = (): Metadata => ({
  title: `재료를 찾을 수 없습니다 - ${SEO_CONSTANTS.SITE_NAME}`,
  description: "요청하신 재료를 찾을 수 없습니다.",
});
