import type { Metadata } from "next";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import {
  determineRecipeType,
  generateYoutubeDescription,
  generateYoutubeKeywords,
  generateYoutubeTitlePrefix,
  generateYoutubeTitleSuffix,
  selectOptimalImages,
} from "./seo";
import { extractYoutubeMetadata } from "./youtube";

export const generateRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string
): Metadata => {
  const youtubeMetadata = extractYoutubeMetadata(recipe);
  const recipeType = determineRecipeType(recipe, youtubeMetadata);

  const titleKeywords: string[] = [];

  const baseUrl = SEO_CONSTANTS.SITE_URL.endsWith("/")
    ? SEO_CONSTANTS.SITE_URL.slice(0, -1)
    : SEO_CONSTANTS.SITE_URL;

  const BUDGET_FRIENDLY_THRESHOLD = 5000;
  const AFFORDABLE_THRESHOLD = 10000;

  if (recipe.totalIngredientCost > 0) {
    if (recipe.totalIngredientCost <= BUDGET_FRIENDLY_THRESHOLD) {
      const thousandWon = Math.floor(recipe.totalIngredientCost / 1000);
      titleKeywords.push(`[${thousandWon}천원]`);
    } else if (recipe.totalIngredientCost <= AFFORDABLE_THRESHOLD) {
      titleKeywords.push("[만원요리]");
    }
  }

  const QUICK_RECIPE_TIME = 15;
  const EASY_RECIPE_TIME = 30;

  if (recipe.cookingTime <= QUICK_RECIPE_TIME) {
    titleKeywords.push("[15분컷]");
  } else if (recipe.cookingTime <= EASY_RECIPE_TIME) {
    titleKeywords.push("[초간단]");
  }

  const tagKeywordMap: Record<string, string> = {
    다이어트: "다이어트",
    자취: "자취생",
    "1인분": "1인분",
    간편식: "간편식",
    야식: "야식",
    도시락: "도시락",
    다이어트식단: "저칼로리",
    단백질: "단백질",
    채식: "채식",
    비건: "비건",
  };

  recipe.tags.forEach((tag) => {
    const keyword = tagKeywordMap[tag];
    if (keyword && !titleKeywords.includes(keyword)) {
      titleKeywords.push(keyword);
    }
  });

  const MAX_TITLE_KEYWORDS = 2;
  const titlePrefix = titleKeywords.slice(0, MAX_TITLE_KEYWORDS).join("");

  let defaultTitle = "";
  if (youtubeMetadata && recipeType !== "chef-tv-show") {
    const youtubePrefix = generateYoutubeTitlePrefix(
      youtubeMetadata.channelName,
      youtubeMetadata.subscriberCount
    );

    if (recipeType === "youtube-famous" || recipeType === "youtube-medium") {
      if (recipeType === "youtube-medium" && youtubePrefix) {
        defaultTitle = `${youtubePrefix} ${titlePrefix} ${recipe.title} - ${youtubeMetadata.channelName} | ${SEO_CONSTANTS.SITE_NAME}`;
      } else {
        defaultTitle = youtubePrefix
          ? `${youtubePrefix} ${titlePrefix} ${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`
          : `${titlePrefix} ${recipe.title} - ${youtubeMetadata.channelName} | ${SEO_CONSTANTS.SITE_NAME}`;
      }
    } else {
      const youtubeSuffix = generateYoutubeTitleSuffix(
        youtubeMetadata.channelName
      );
      defaultTitle = titlePrefix
        ? `${titlePrefix} ${recipe.title} ${youtubeSuffix} | ${SEO_CONSTANTS.SITE_NAME}`
        : `${recipe.title} ${youtubeSuffix} | ${SEO_CONSTANTS.SITE_NAME}`;
    }
  } else {
    defaultTitle = titlePrefix
      ? `${titlePrefix} ${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`
      : `${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`;
  }

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
    const chefTitle = `[15분 레시피] ${recipe.title} | ${SEO_CONSTANTS.SITE_NAME}`;
    const chefDescription = `흑백요리사, 냉장고를 부탁해 등 유명 셰프들의 15분 레시피 후기를 만나보세요. ${recipe.title} 레시피로 집에서 파인다이닝을 즐겨보세요!`;
    const chefKeywords = [
      "흑백요리사",
      "흑백요리사2",
      "냉장고를부탁해",
      "15분레시피",
      "냉장고를부탁해 15분레시피",
      "셰프 레시피",
      "파인다이닝",
      "RECIPIO",
      "안성재",
      "최현석",
      "에드워드 리",
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
