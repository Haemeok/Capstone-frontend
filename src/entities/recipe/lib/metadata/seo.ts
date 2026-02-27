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
    channelContext = `구독자 ${formatSubscriberCount(subscriberCount)}의 ${youtubeMetadata.channelName}이(가) 공개한 ${recipe.title} 레시피를 레시피오에서 만나보세요!`;
  } else if (subscriberCount >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.FAMOUS) {
    channelContext = `인기 유튜버 ${youtubeMetadata.channelName}의 ${recipe.title} 레시피를 레시피오에서 만나보세요!`;
  } else {
    channelContext = `${youtubeMetadata.channelName} 채널의 ${recipe.title} 레시피를 레시피오에서 만나보세요!`;
  }

  const valueProposition =
    "원본 영상의 핵심 내용을 정리하여 재료비용과 영양정보를 추가했습니다.";

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
    const savings = recipe.marketPrice - recipe.totalIngredientCost;
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
    details.push(`🍽️ 1인분 기준: 칼로리 ${recipe.totalCalories}kcal`);
  }

  const detailsSection = details.length > 0 ? `\n\n${details.join("\n")}` : "";

  return `${channelContext} ${valueProposition}\n\n${baseDescription}${detailsSection}`;
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
  if (youtubeMetadata?.thumbnailUrl && recipe.imageUrl !== youtubeMetadata.thumbnailUrl) {
    return {
      primary: recipe.imageUrl,
      secondary: youtubeMetadata.thumbnailUrl,
    };
  }

  return {
    primary: recipe.imageUrl,
  };
};
