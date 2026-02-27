import type { Metadata } from "next";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS, YOUTUBE_SEO } from "./constants";

type RecipeType =
  | "chef-tv-show"
  | "youtube-famous"
  | "youtube-medium"
  | "youtube-standard"
  | "standard";

type YoutubeMetadata = {
  channelName: string;
  videoTitle?: string;
  thumbnailUrl?: string;
  channelProfileUrl?: string;
  subscriberCount?: number;
};

const extractYoutubeMetadata = (
  recipe: StaticRecipe
): YoutubeMetadata | undefined => {
  if (!recipe.youtubeUrl || !recipe.youtubeChannelName) {
    return undefined;
  }

  return {
    channelName: recipe.youtubeChannelName,
    videoTitle: recipe.youtubeVideoTitle,
    thumbnailUrl: recipe.youtubeThumbnailUrl,
    channelProfileUrl: recipe.youtubeChannelProfileUrl,
    subscriberCount: recipe.youtubeSubscriberCount,
  };
};

const determineRecipeType = (
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

const formatSubscriberCount = (count: number): string => {
  if (count >= YOUTUBE_SEO.SUBSCRIBER_THRESHOLDS.MILLION) {
    const millions = Math.floor(count / 10000) / 100;
    return `${millions}만명`;
  } else if (count >= 10000) {
    const tenThousands = Math.floor(count / 10000);
    return `${tenThousands}만명`;
  } else if (count >= 1000) {
    const thousands = Math.floor(count / 1000);
    return `${thousands}천명`;
  }
  return `${count}명`;
};

const generateYoutubeDescription = (
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

const generateYoutubeKeywords = (
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

const selectOptimalImages = (
  recipe: StaticRecipe,
  youtubeMetadata?: YoutubeMetadata
): { primary: string; secondary?: string } => {
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

export const generateRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string
): Metadata => {
  const youtubeMetadata = extractYoutubeMetadata(recipe);
  const recipeType = determineRecipeType(recipe, youtubeMetadata);

  const baseUrl = SEO_CONSTANTS.SITE_URL.endsWith("/")
    ? SEO_CONSTANTS.SITE_URL.slice(0, -1)
    : SEO_CONSTANTS.SITE_URL;

  const BUDGET_FRIENDLY_THRESHOLD = 5000;
  const AFFORDABLE_THRESHOLD = 10000;
  const QUICK_RECIPE_TIME = 15;
  const EASY_RECIPE_TIME = 30;

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

  // 키워드 우선순위: 태그 → 시간 → 비용 (1개만 선택)
  let titleBracket = "";

  for (const tag of recipe.tags) {
    const keyword = tagKeywordMap[tag];
    if (keyword) {
      titleBracket = keyword;
      break;
    }
  }

  if (!titleBracket) {
    if (recipe.cookingTime <= QUICK_RECIPE_TIME) {
      titleBracket = "[15분컷⏱️]";
    } else if (recipe.cookingTime <= EASY_RECIPE_TIME) {
      titleBracket = "[초간단⚡]";
    }
  }

  if (!titleBracket && recipe.totalIngredientCost > 0) {
    if (recipe.totalIngredientCost <= BUDGET_FRIENDLY_THRESHOLD) {
      const thousandWon = Math.floor(recipe.totalIngredientCost / 1000);
      titleBracket = `[${thousandWon}천원💰]`;
    } else if (recipe.totalIngredientCost <= AFFORDABLE_THRESHOLD) {
      titleBracket = "[만원💰]";
    }
  }

  const timeText = recipe.cookingTime > 0 ? `${recipe.cookingTime}분 완성` : "";
  const youtubeSource =
    youtubeMetadata && recipeType !== "chef-tv-show"
      ? `(출처: ${youtubeMetadata.channelName} 유튜브)`
      : "";

  const titleParts = [
    titleBracket,
    recipe.title,
    timeText,
    youtubeSource,
  ].filter(Boolean);

  const defaultTitle = `${titleParts.join(" ")} | ${SEO_CONSTANTS.SITE_NAME}`;

  const costInfo = recipe.totalIngredientCost
    ? `예상비용: ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원`
    : "";
  const timeInfo = recipe.cookingTime ? `${recipe.cookingTime}분 소요` : "";
  const additionalInfo = [costInfo, timeInfo].filter(Boolean).join(", ");

  const baseDescription = recipe.description
    ? `${recipe.description}${additionalInfo ? ` (${additionalInfo})` : ""}`
    : `${recipe.title} 레시피! AI가 제안하는 ${recipe.totalIngredientCost.toLocaleString("ko-KR")}원 가성비 요리법을 확인하세요.`;

  const defaultDescription =
    youtubeMetadata && recipeType !== "chef-tv-show"
      ? generateYoutubeDescription(recipe, baseDescription, youtubeMetadata)
      : baseDescription;

  const dynamicKeywords: string[] = [];

  if (recipe.totalIngredientCost <= BUDGET_FRIENDLY_THRESHOLD) {
    dynamicKeywords.push("가성비요리", "저렴한요리", "3000원요리");
  } else if (recipe.totalIngredientCost <= AFFORDABLE_THRESHOLD) {
    dynamicKeywords.push("만원요리", "알뜰요리");
  }

  if (recipe.cookingTime <= QUICK_RECIPE_TIME) {
    dynamicKeywords.push("간단요리", "10분요리", "15분요리", "빠른요리");
  } else if (recipe.cookingTime <= EASY_RECIPE_TIME) {
    dynamicKeywords.push("초간단요리", "30분요리", "쉬운요리");
  }

  const situationKeywords: Record<string, string[]> = {
    다이어트: ["다이어트요리", "저칼로리", "건강식"],
    자취: ["자취요리", "자취생레시피", "1인요리"],
    간편식: ["간편요리", "편의점요리"],
    야식: ["야식레시피", "살안찌는야식"],
    도시락: ["도시락메뉴", "도시락반찬"],
    "1인분": ["1인분요리", "혼밥"],
  };

  recipe.tags.forEach((tag) => {
    const keywords = situationKeywords[tag];
    if (keywords) {
      dynamicKeywords.push(...keywords);
    }
  });

  const youtubeKeywords =
    youtubeMetadata && recipeType !== "chef-tv-show"
      ? generateYoutubeKeywords(recipe, youtubeMetadata)
      : [];

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
    keywords: [
      ...SEO_CONSTANTS.DEFAULT_KEYWORDS,
      recipe.title,
      ...recipe.tags,
      ...dynamicKeywords,
      ...youtubeKeywords,
    ],
    alternates: {
      canonical: fullPageUrl,
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: fullPageUrl,
      siteName: SEO_CONSTANTS.SITE_NAME,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: SEO_CONSTANTS.LOCALE,
      images: ogImages,
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title: defaultTitle,
      description: defaultDescription,
      images: twitterImages,
    },
  };

  if (recipeType === "chef-tv-show") {
    const chefTitle = `[셰프레시피👨‍🍳] ${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`;
    const chefDescription = recipe.description
      ? `${recipe.description} ${recipe.title} 레시피를 레시피오에서 만나보세요!`
      : `${recipe.title} 셰프 레시피를 레시피오에서 만나보세요!`;
    const chefKeywords = [
      "셰프 레시피",
      "15분레시피",
      "파인다이닝",
      ...(baseMetadata.keywords as string[]),
    ];

    return {
      ...baseMetadata,
      title: chefTitle,
      description: chefDescription,
      keywords: chefKeywords,
      openGraph: {
        ...baseMetadata.openGraph,
        title: chefTitle,
        description: chefDescription,
      },
      twitter: {
        ...baseMetadata.twitter,
        title: chefTitle,
        description: chefDescription,
      },
    };
  }

  return baseMetadata;
};

export const generateNotFoundRecipeMetadata = (): Metadata => ({
  title: `레시피를 찾을 수 없습니다 - ${SEO_CONSTANTS.SITE_NAME}`,
  description: "요청하신 레시피를 찾을 수 없습니다.",
});
