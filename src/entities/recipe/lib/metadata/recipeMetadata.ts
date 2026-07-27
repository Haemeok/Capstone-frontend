import type { Metadata } from "next";

import type { Locale } from "@/shared/i18n";
import { createRecipeBreadcrumb } from "@/shared/lib/metadata/breadcrumbSchema";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import { createRecipeStructuredData } from "./schema";
import {
  determineRecipeType,
  generateYoutubeDescription,
  normalizeChannelName,
  selectOptimalImages,
} from "./seo";
import { extractYoutubeMetadata } from "./youtube";

export const generateRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string
): Metadata => {
  const youtubeMetadata = extractYoutubeMetadata(recipe);
  const recipeType = determineRecipeType(recipe, youtubeMetadata);

  const baseUrl = SEO_CONSTANTS.SITE_URL.endsWith("/")
    ? SEO_CONSTANTS.SITE_URL.slice(0, -1)
    : SEO_CONSTANTS.SITE_URL;

  const AFFORDABLE_THRESHOLD = 10000;
  const QUICK_RECIPE_TIME = 15;
  const EASY_RECIPE_TIME = 30;
  const MIN_COST_BRACKET = 1000;

  const tagKeywordMap: Record<string, string> = {
    다이어트: "[다이어트🥗]",
    자취: "[자취생🏠]",
    "1인분": "[1인분🍽️]",
    간편식: "[간편식✨]",
    야식: "[야식🌙]",
    도시락: "[도시락🍱]",
    다이어트식단: "[저칼로리🥗]",
    단백질: "[단백질💪]",
    채식: "[채식🌿]",
    비건: "[비건🌱]",
  };

  const ORIGIN_BRACKET: Record<string, string> = {
    JP: "[🇯🇵현지레시피]",
    OTHER: "[🌍전세계레시피]",
  };
  const originBracket = recipe.creatorCountryTag
    ? (ORIGIN_BRACKET[recipe.creatorCountryTag] ?? "")
    : "";

  const titleHasOwnTime = /\d+\s*분/.test(recipe.title);

  let titleBracket = originBracket;
  let suppressTime =
    Boolean(originBracket) ||
    titleHasOwnTime ||
    recipe.cookingTime > EASY_RECIPE_TIME;

  if (!titleBracket) {
    for (const tag of recipe.tags) {
      const keyword = tagKeywordMap[tag];
      if (keyword) {
        titleBracket = keyword;
        break;
      }
    }
  }

  if (!titleBracket && !titleHasOwnTime) {
    if (recipe.cookingTime <= QUICK_RECIPE_TIME) {
      titleBracket = "[15분컷⏱️]";
      suppressTime = true;
    } else if (recipe.cookingTime <= EASY_RECIPE_TIME) {
      titleBracket = "[초간단⚡]";
    }
  }

  if (!titleBracket && recipe.totalIngredientCost >= MIN_COST_BRACKET) {
    if (recipe.totalIngredientCost < AFFORDABLE_THRESHOLD) {
      const thousandWon = Math.floor(recipe.totalIngredientCost / 1000);
      titleBracket = `[${thousandWon}천원💰]`;
    } else if (recipe.totalIngredientCost === AFFORDABLE_THRESHOLD) {
      titleBracket = "[만원💰]";
    }
  }

  const timeText =
    !suppressTime && recipe.cookingTime > 0
      ? `${recipe.cookingTime}분 완성`
      : "";

  const TITLE_BUDGET = 25;
  const normalizedChannel =
    recipeType === "youtube-famous" && youtubeMetadata
      ? normalizeChannelName(youtubeMetadata.channelName)
      : null;
  const channelPrefixedTitle = normalizedChannel
    ? `${normalizedChannel} ${recipe.title}`
    : null;
  const useChannelTitle =
    !originBracket &&
    channelPrefixedTitle !== null &&
    channelPrefixedTitle.length <= TITLE_BUDGET;

  const pageTitle = useChannelTitle
    ? channelPrefixedTitle
    : [titleBracket, recipe.title, timeText].filter(Boolean).join(" ");
  const defaultTitle = `${pageTitle} | ${SEO_CONSTANTS.SITE_NAME}`;

  const costInfo = recipe.totalIngredientCost
    ? `예상비용: ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원`
    : "";
  const timeInfo = recipe.cookingTime ? `${recipe.cookingTime}분 소요` : "";
  const additionalInfo = [costInfo, timeInfo].filter(Boolean).join(", ");

  const youtubeNarrative =
    youtubeMetadata && recipeType !== "chef-tv-show"
      ? youtubeMetadata
      : undefined;

  const baseDescription = recipe.description
    ? `${recipe.description}${!youtubeNarrative && additionalInfo ? ` (${additionalInfo})` : ""}`
    : recipe.totalIngredientCost > 0
      ? `${recipe.title} 레시피! AI가 제안하는 ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원 가성비 요리법을 확인하세요.`
      : `${recipe.title} 레시피! 재료와 조리 순서를 한눈에 확인하세요.`;

  const defaultDescription = youtubeNarrative
    ? generateYoutubeDescription(recipe, baseDescription, youtubeNarrative)
    : baseDescription;

  const fullPageUrl = `${baseUrl}/recipes/${recipeId}`;

  const images = selectOptimalImages(recipe, youtubeMetadata);
  const ogImages = [
    {
      url: images.primary,
      width: 1200,
      height: 630,
      alt: youtubeMetadata
        ? `${recipe.title} - ${youtubeMetadata.channelName}`
        : `${recipe.title} - ${SEO_CONSTANTS.SITE_NAME}`,
    },
  ];

  if (images.secondary) {
    ogImages.push({
      url: images.secondary,
      width: 1200,
      height: 630,
      alt: `${recipe.title} 완성 사진`,
    });
  }

  const twitterImages = [images.primary];
  if (images.secondary) {
    twitterImages.push(images.secondary);
  }

  const baseMetadata: Metadata = {
    title: defaultTitle,
    description: defaultDescription,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: recipe.isIndexed === true,
        follow: true,
      },
    },
    alternates: {
      canonical: fullPageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: defaultDescription,
      url: fullPageUrl,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: SEO_CONSTANTS.LOCALE,
      images: ogImages,
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: pageTitle,
      description: defaultDescription,
      images: twitterImages,
    },
  };

  if (recipeType === "chef-tv-show" && !originBracket) {
    const chefPageTitle = `[셰프레시피👨‍🍳] ${recipe.title}`;
    const chefTitle = `${chefPageTitle} | ${SEO_CONSTANTS.SITE_NAME}`;
    const chefDescription = recipe.description
      ? `${recipe.description} ${recipe.title} 레시피를 레시피오에서 만나보세요!`
      : `${recipe.title} 셰프 레시피를 레시피오에서 만나보세요!`;
    return {
      ...baseMetadata,
      title: chefTitle,
      description: chefDescription,
      openGraph: {
        ...baseMetadata.openGraph,
        title: chefPageTitle,
        description: chefDescription,
      },
      twitter: {
        ...baseMetadata.twitter,
        title: chefPageTitle,
        description: chefDescription,
      },
    };
  }

  return baseMetadata;
};

export const generateRecipeJsonLd = (
  recipe: StaticRecipe,
  recipeId: string,
  locale: Locale = "ko"
) => ({
  "@context": "https://schema.org",
  "@graph": [
    createRecipeBreadcrumb(recipe.title, recipeId, locale),
    createRecipeStructuredData(recipe, recipeId, locale),
  ],
});

export const generateNotFoundRecipeMetadata = (): Metadata => ({
  title: `레시피를 찾을 수 없습니다 - ${SEO_CONSTANTS.SITE_NAME}`,
  description: "요청하신 레시피를 찾을 수 없습니다.",
  robots: { index: false, follow: false },
});
