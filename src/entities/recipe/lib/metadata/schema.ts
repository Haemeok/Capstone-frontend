import { absoluteUrl } from "@/shared/config/constants/api";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "@/shared/config/constants/appStore";
import {
  TOTAL_RECIPE_COUNT_LABEL,
  TOTAL_RECIPE_COUNT_PHRASE,
} from "@/shared/config/constants/siteStats";
import type { Locale } from "@/shared/i18n";
import { createSearchBreadcrumb } from "@/shared/lib/metadata/breadcrumbSchema";
import { localizedPath } from "@/shared/lib/metadata/localized";

import type {
  DetailedRecipeGridItem,
  StaticRecipe,
} from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import { toIso8601 } from "./dateTime";
import { createEnhancedVideoObject, extractYoutubeMetadata } from "./youtube";

export const createWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SEO_CONSTANTS.SITE_NAME,
  description: SEO_CONSTANTS.SITE_DESCRIPTION,
  url: SEO_CONSTANTS.SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: absoluteUrl("search?q={search_term_string}"),
    "query-input": "required name=search_term_string",
  },
});

export const createRecipeStructuredData = (
  recipe: StaticRecipe,
  recipeId: string,
  locale: Locale = "ko"
) => {
  const youtubeMetadata = extractYoutubeMetadata(recipe);

  const PREP_TIME_RATIO = 0.3;
  const MIN_PREP_TIME_MINUTES = 5;
  const prepTimeMinutes = recipe.cookingTime
    ? Math.max(
        MIN_PREP_TIME_MINUTES,
        Math.round(recipe.cookingTime * PREP_TIME_RATIO)
      )
    : MIN_PREP_TIME_MINUTES;

  const totalTimeMinutes = recipe.cookingTime
    ? prepTimeMinutes + recipe.cookingTime
    : prepTimeMinutes;

  const savings = recipe.marketPrice - recipe.totalIngredientCost;
  const MINIMUM_SAVINGS_THRESHOLD = 0;
  const costDescription =
    locale === "ko" && savings > MINIMUM_SAVINGS_THRESHOLD
      ? `[${savings.toLocaleString("ko-KR")}원 절약 레시피] `
      : "";

  const enhancedDescription = `${costDescription}${recipe.description}`;

  const videoObject = youtubeMetadata
    ? createEnhancedVideoObject(recipe, youtubeMetadata, locale)
    : recipe.youtubeUrl
      ? {
          "@type": "VideoObject" as const,
          name: locale === "ko" ? `${recipe.title} 만들기` : recipe.title,
          description: recipe.description,
          thumbnailUrl: recipe.imageUrl || "",
          contentUrl: recipe.youtubeUrl,
          uploadDate: toIso8601(recipe.createdAt),
        }
      : undefined;

  const imageArray = youtubeMetadata?.thumbnailUrl
    ? [
        youtubeMetadata.thumbnailUrl,
        recipe.imageUrl || SEO_CONSTANTS.DEFAULT_IMAGE,
      ]
    : [recipe.imageUrl || SEO_CONSTANTS.DEFAULT_IMAGE];

  const author = youtubeMetadata
    ? {
        "@type": "Person" as const,
        name: youtubeMetadata.channelName,
        ...(youtubeMetadata.channelProfileUrl && {
          image: youtubeMetadata.channelProfileUrl,
        }),
      }
    : {
        "@type": "Person" as const,
        name: recipe.author?.nickname || SEO_CONSTANTS.SITE_NAME,
      };

  const CUISINE_BY_COUNTRY: Record<string, string> = {
    KR: "Korean",
    JP: "Japanese",
  };
  const recipeCuisine = recipe.creatorCountryTag
    ? CUISINE_BY_COUNTRY[recipe.creatorCountryTag]
    : "Korean";

  return {
    "@type": "Recipe",
    name: recipe.title,
    description: enhancedDescription,
    image: imageArray,
    author,
    datePublished: toIso8601(recipe.createdAt),

    prepTime: `PT${prepTimeMinutes}M`,
    ...(recipe.cookingTime && {
      cookTime: `PT${recipe.cookingTime}M`,
      totalTime: `PT${totalTimeMinutes}M`,
    }),

    ...(recipe.servings && {
      recipeYield: `${recipe.servings} servings`,
    }),

    recipeIngredient:
      recipe.ingredients?.map((ingredient) => {
        const quantity = ingredient.quantity || "";
        const unit = ingredient.unit || "";
        const amount =
          quantity && unit ? `${quantity}${unit}` : quantity || unit;
        return amount ? `${ingredient.name} ${amount}` : ingredient.name;
      }) || [],
    recipeInstructions:
      recipe.steps?.map((step, index) => ({
        "@type": "HowToStep",
        name: `Step ${index + 1}`,
        position: index + 1,
        text: step.instruction,
        url: absoluteUrl(
          localizedPath(locale, `recipes/${recipeId}#step-${index + 1}`)
        ),
        ...(step.stepImageUrl && { image: step.stepImageUrl }),
      })) || [],

    ...(recipe.ratingInfo?.avgRating &&
      recipe.ratingInfo.ratingCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: recipe.ratingInfo.avgRating,
          ratingCount: recipe.ratingInfo.ratingCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    ...(recipe.totalCalories && {
      nutrition: {
        "@type": "NutritionInformation",
        ...(recipe.nutrition && {
          protein: `${recipe.nutrition.protein} g`,
          carbohydrate: `${recipe.nutrition.carbohydrate} g`,
          fat: `${recipe.nutrition.fat} g`,
          sugar: `${recipe.nutrition.sugar} g`,
          sodium: `${recipe.nutrition.sodium} mg`,
        }),
        calories: `${recipe.totalCalories} calories`,
      },
    }),
    recipeCategory: recipe.dishType,
    ...(recipeCuisine && { recipeCuisine }),
    keywords: recipe.tags?.join(", ") || "",
    ...(videoObject && { video: videoObject }),
    ...(youtubeMetadata &&
      recipe.youtubeUrl && {
        isBasedOn: {
          "@type": "VideoObject" as const,
          "@id": recipe.youtubeUrl,
          name:
            youtubeMetadata.videoTitle ||
            (locale === "ko" ? `${recipe.title} 만들기` : recipe.title),
          url: recipe.youtubeUrl,
        },
      }),
    url: absoluteUrl(localizedPath(locale, `recipes/${recipeId}`)),
  };
};

type LandingFAQEntry = {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
};

const LANDING_FAQ_BY_LOCALE: Record<Locale, LandingFAQEntry[]> = {
  ko: [
    {
      "@type": "Question",
      name: "레시피오는 어떤 서비스인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `레시피오는 한국어·일본어·영어로 ${TOTAL_RECIPE_COUNT_PHRASE.ko}의 홈쿡 레시피를 제공하는 글로벌 레시피 플랫폼입니다. YouTube 링크를 붙여넣기만 하면 레시피로 자동 추출되고, AI가 상황과 재료에 맞게 레시피를 추천해줍니다.`,
      },
    },
    {
      "@type": "Question",
      name: "어떤 나라 레시피를 찾을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "한국 가정식은 물론 일본 현지 가정식, 미국 현지 레시피까지 폭넓게 다룹니다. 일본어·영어 페이지에서는 해당 국가의 현지 레시피를 그 나라 언어로 그대로 볼 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "YouTube 링크로 어떻게 레시피를 만드나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "'/recipes/new/youtube' 페이지에서 YouTube 영상 링크를 붙여넣으면 재료·조리순서·분량이 자동으로 추출되어 레시피로 저장됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "무료로 이용할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 레시피 탐색, YouTube 추출, AI 추천, 냉장고 재료 기반 추천까지 모든 핵심 기능을 무료로 사용할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "냉장고 재료로 레시피를 찾을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. '/recipes/my-fridge'에서 보유한 재료를 등록하면 AI가 그 재료로 만들 수 있는 레시피를 자동으로 추천해줍니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 상황별 레시피가 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "홈파티, 기념일, 집들이, 브런치, 혼밥, 도시락, 다이어트, 야식, 술안주, 해장, 캠핑, 아이 반찬 등 상황별 태그로 레시피를 찾을 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "AI 레시피 생성은 어떻게 작동하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "가성비, 특정 영양성분 조합, 파인다이닝, 냉장고 재료 기반 네 가지 모드로 원하는 조건의 레시피를 AI가 생성해줍니다.",
      },
    },
  ],
  ja: [
    {
      "@type": "Question",
      name: "レシピオとはどんなサービスですか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `レシピオは、韓国語・日本語・英語で${TOTAL_RECIPE_COUNT_PHRASE.ja}の家庭料理レシピを提供するグローバルなレシピプラットフォームです。YouTube動画のリンクを貼るだけでレシピが自動で抽出され、手持ちの食材やシーンに合わせてAIがレシピを提案します。`,
      },
    },
    {
      "@type": "Question",
      name: "どの国のレシピが見つかりますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "韓国の家庭料理はもちろん、日本の家庭料理やアメリカの現地レシピまで幅広く揃えています。日本語ページでは、日本向けのレシピを日本語のまま快適にご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "YouTubeのリンクからどうやってレシピを作るのですか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「/recipes/new/youtube」でYouTube動画のリンクを貼り付けると、材料・手順・分量が自動で抽出され、レシピとして保存されます。",
      },
    },
    {
      "@type": "Question",
      name: "無料で使えますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。レシピの検索、YouTube抽出、AIおすすめ、冷蔵庫の食材からのおすすめまで、主要な機能をすべて無料でご利用いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "冷蔵庫の食材からレシピを探せますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。「/recipes/my-fridge」で持っている食材を登録すると、その食材で作れるレシピをAIが自動で提案します。",
      },
    },
    {
      "@type": "Question",
      name: "シーン別のレシピはありますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ホームパーティー、記念日、ひとりごはん、お弁当、ダイエット、夜食、おつまみ、キャンプ、子ども向けなど、シーン別のタグからレシピを探せます。",
      },
    },
    {
      "@type": "Question",
      name: "AIレシピ生成はどのように機能しますか?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "コスパ重視、栄養素の組み合わせ、ファインダイニング、冷蔵庫の食材ベースの4つのモードで、希望の条件に合わせてAIがレシピを生成します。",
      },
    },
  ],
  en: [
    {
      "@type": "Question",
      name: "What is Recipio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Recipio is a global recipe platform offering ${TOTAL_RECIPE_COUNT_LABEL.en} home-cooking recipes in Korean, Japanese, and English. Paste a YouTube link to turn the video into a recipe automatically, and let AI recommend dishes based on your ingredients and the occasion.`,
      },
    },
    {
      "@type": "Question",
      name: "Which countries' recipes can I find?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You'll find authentic home cooking from Korea, Japan, and the United States. The English and Japanese sites serve each region's local recipes in its own language.",
      },
    },
    {
      "@type": "Question",
      name: "How do I turn a YouTube link into a recipe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On '/recipes/new/youtube', paste a YouTube video link and the ingredients, steps, and portions are extracted automatically and saved as a recipe.",
      },
    },
    {
      "@type": "Question",
      name: "Is it free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Browsing recipes, YouTube extraction, AI recommendations, and fridge-based suggestions are all free.",
      },
    },
    {
      "@type": "Question",
      name: "Can I find recipes from the ingredients in my fridge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Add the ingredients you have on '/recipes/my-fridge', and AI automatically suggests recipes you can make with them.",
      },
    },
    {
      "@type": "Question",
      name: "Are there recipes for specific occasions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — browse by tags like home party, anniversary, solo meals, lunchbox, diet, late-night, bar snacks, camping, and kids' meals.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI recipe generation work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Choose from four modes — budget-friendly, specific nutrition targets, fine dining, and fridge-based — and AI generates a recipe for your chosen conditions.",
      },
    },
  ],
};

export const createLandingFAQStructuredData = (locale: Locale = "ko") =>
  ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LANDING_FAQ_BY_LOCALE[locale],
  }) as const;

const ORGANIZATION_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  ko: `레시피오는 한국어·일본어·영어로 ${TOTAL_RECIPE_COUNT_PHRASE.ko}의 홈쿡 레시피를 제공하는 글로벌 레시피 플랫폼입니다. 한국·일본·미국 현지 가정식 레시피를 다루며, YouTube 영상에서 레시피를 자동 추출하고 AI가 재료와 상황에 맞는 레시피를 추천합니다.`,
  ja: `レシピオは、韓国語・日本語・英語で${TOTAL_RECIPE_COUNT_PHRASE.ja}の家庭料理レシピを提供するグローバルなレシピプラットフォームです。韓国・日本・アメリカの家庭料理レシピを扱い、YouTube動画からレシピを自動抽出し、食材やシーンに合わせてAIがレシピを提案します。`,
  en: `Recipio is a global recipe platform offering ${TOTAL_RECIPE_COUNT_LABEL.en} home-cooking recipes in Korean, Japanese, and English. It features authentic home cooking from Korea, Japan, and the United States, automatically extracts recipes from YouTube videos, and uses AI to recommend dishes based on your ingredients and occasion.`,
};

export const createOrganizationStructuredData = (locale: Locale = "ko") =>
  ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_CONSTANTS.SITE_NAME,
    alternateName: "Recipio",
    url: SEO_CONSTANTS.SITE_URL,
    logo: SEO_CONSTANTS.DEFAULT_IMAGE,
    description: ORGANIZATION_DESCRIPTION_BY_LOCALE[locale],
    sameAs: [APP_STORE_URL, PLAY_STORE_URL],
  }) as const;

export const createTagItemListStructuredData = (
  tags: Array<{ code: string; name: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: tags.map((tag, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: tag.name,
    url: absoluteUrl(`search/results?tags=${encodeURIComponent(tag.code)}`),
  })),
});

const MAX_SEARCH_ITEMS = 10;

export const createSearchResultsJsonLd = (
  query: string,
  recipes: DetailedRecipeGridItem[],
  totalElements: number,
  title: string,
  canonicalUrl?: string
) => ({
  "@context": "https://schema.org",
  "@graph": [
    createSearchBreadcrumb(query, canonicalUrl),
    {
      "@type": "ItemList",
      name: title,
      numberOfItems: totalElements,
      itemListElement: recipes.slice(0, MAX_SEARCH_ITEMS).map((recipe, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`recipes/${recipe.id}`),
        name: recipe.title,
        image: recipe.imageUrl,
      })),
    },
  ],
});
