import type { StaticRecipe } from "@/entities/recipe/model/types";

import { YOUTUBE_SEO } from "./constants";
import type { YoutubeMetadata } from "./youtube";
import { formatSubscriberCount } from "./youtube";

export type RecipeType =
  | "chef-tv-show"
  | "youtube-famous"
  | "youtube-medium"
  | "youtube-standard"
  | "standard";

export type ImageSelection = {
  primary: string;
  secondary?: string;
};

export const normalizeChannelName = (channelName: string): string | null => {
  const koreanTokens = channelName
    .split(/\s+/)
    .filter((token) => /[가-힣]/.test(token));
  return koreanTokens.length > 0 ? koreanTokens.join(" ") : null;
};

export const determineRecipeType = (
  recipe: StaticRecipe,
  youtubeMetadata?: YoutubeMetadata
): RecipeType => {
  const isChefRecipe =
    recipe.title.includes("흑백요리사") ||
    recipe.tags.some((tag) => tag === "셰프 레시피");

  if (isChefRecipe) {
    return "chef-tv-show";
  }

  if (youtubeMetadata?.channelName) {
    const subscriberCount = youtubeMetadata.subscriberCount || 0;

    if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.FAMOUS) {
      return "youtube-famous";
    } else if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.MEDIUM) {
      return "youtube-medium";
    } else {
      return "youtube-standard";
    }
  }

  return "standard";
};

export const generateYoutubeDescription = (
  recipe: StaticRecipe,
  baseDescription: string,
  youtubeMetadata: YoutubeMetadata
): string => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;

  let channelContext = "";
  if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.MILLION) {
    channelContext = `구독자 ${formatSubscriberCount(subscriberCount)} ${youtubeMetadata.channelName}의 ${recipe.title} 레시피`;
  } else if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.FAMOUS) {
    channelContext = `인기 유튜버 ${youtubeMetadata.channelName}의 ${recipe.title} 레시피`;
  } else {
    channelContext = `${youtubeMetadata.channelName} 채널의 ${recipe.title} 레시피`;
  }

  const savings = recipe.marketPrice - recipe.totalIngredientCost;
  let costHook = "";
  if (recipe.totalIngredientCost > 0) {
    costHook =
      savings > 0
        ? ` — 재료비 ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원, 시장가 대비 ${savings.toLocaleString("ko-KR")}원 절약`
        : ` — 재료비 ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원`;
  }

  const lead = `${channelContext}${costHook}.`;

  const details: string[] = [];

  if (youtubeMetadata.videoTitle) {
    details.push(`📺 원본 영상: ${youtubeMetadata.videoTitle}`);
  }

  if (subscriberCount > 0) {
    details.push(
      `👤 크리에이터: ${youtubeMetadata.channelName} (구독자 ${formatSubscriberCount(subscriberCount)})`
    );
  }

  if (recipe.totalIngredientCost > 0) {
    if (savings > 0) {
      details.push(
        `💰 예상 재료비: ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원 (시장가 대비 ${savings.toLocaleString("ko-KR")}원 절약)`
      );
    } else {
      details.push(
        `💰 예상 재료비: ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원`
      );
    }
  }

  if (recipe.cookingTime) {
    details.push(`⏱️ 조리 시간: ${recipe.cookingTime}분`);
  }

  if (recipe.totalCalories) {
    const nutritionParts = [`칼로리 ${recipe.totalCalories}kcal`];
    const nutrition = recipe.nutrition;
    if (nutrition?.carbohydrate) {
      nutritionParts.push(`탄수화물 ${nutrition.carbohydrate}g`);
    }
    if (nutrition?.protein) {
      nutritionParts.push(`단백질 ${nutrition.protein}g`);
    }
    if (nutrition?.fat) {
      nutritionParts.push(`지방 ${nutrition.fat}g`);
    }
    details.push(`🍽️ 1인분 기준: ${nutritionParts.join(" · ")}`);
  }

  const detailsSection = details.length > 0 ? `\n\n${details.join("\n")}` : "";

  return `${lead}\n\n${baseDescription}${detailsSection}`;
};

export const generateYoutubeKeywords = (
  recipe: StaticRecipe,
  youtubeMetadata: YoutubeMetadata
): string[] => {
  const keywords: string[] = [];

  keywords.push(...YOUTUBE_SEO.KEYWORDS);

  keywords.push(
    youtubeMetadata.channelName,
    `${youtubeMetadata.channelName} 레시피`,
    `${youtubeMetadata.channelName} 요리`,
    `${youtubeMetadata.channelName} ${recipe.title}`
  );

  const subscriberCount = youtubeMetadata.subscriberCount || 0;
  if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.MILLION) {
    keywords.push("유명 셰프", "인기 유튜버", "백만 유튜버");
  } else if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.FAMOUS) {
    keywords.push("인기 요리 채널", "구독자 많은 레시피");
  }

  keywords.push(
    `${recipe.title} 유튜브`,
    `${recipe.title} 만들기 영상`,
    `${recipe.title} 요리법 유튜브`
  );

  return keywords;
};

export const selectOptimalImages = (
  recipe: StaticRecipe,
  youtubeMetadata?: YoutubeMetadata
): ImageSelection => {
  if (
    youtubeMetadata?.thumbnailUrl &&
    recipe.imageUrl !== youtubeMetadata.thumbnailUrl
  ) {
    return {
      primary: recipe.imageUrl,
      secondary: youtubeMetadata.thumbnailUrl,
    };
  }

  return {
    primary: recipe.imageUrl,
  };
};
