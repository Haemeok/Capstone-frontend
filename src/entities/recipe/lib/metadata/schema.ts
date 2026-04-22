import { createSearchBreadcrumb } from "@/shared/lib/metadata/breadcrumbSchema";

import type {
  DetailedRecipeGridItem,
  StaticRecipe,
} from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import { createEnhancedVideoObject, extractYoutubeMetadata } from "./youtube";

export const createWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SEO_CONSTANTS.SITE_NAME,
  description: SEO_CONSTANTS.SITE_DESCRIPTION,
  url: SEO_CONSTANTS.SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SEO_CONSTANTS.SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const createRecipeStructuredData = (
  recipe: StaticRecipe,
  recipeId: string
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
    savings > MINIMUM_SAVINGS_THRESHOLD
      ? `[${savings.toLocaleString("ko-KR")}원 절약 레시피] `
      : "";

  const enhancedDescription = `${costDescription}${recipe.description}`;

  const videoObject = youtubeMetadata
    ? createEnhancedVideoObject(recipe, youtubeMetadata)
    : recipe.youtubeUrl
      ? {
          "@type": "VideoObject" as const,
          name: `${recipe.title} 만들기`,
          description: recipe.description,
          thumbnailUrl: recipe.imageUrl || "",
          contentUrl: recipe.youtubeUrl,
          uploadDate: recipe.createdAt || new Date().toISOString(),
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

  return {
    "@type": "Recipe",
    name: recipe.title,
    description: enhancedDescription,
    image: imageArray,
    author,
    datePublished: recipe.createdAt || new Date().toISOString(),

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
    recipeCuisine: "Korean",
    keywords: recipe.tags?.join(", ") || "",
    ...(videoObject && { video: videoObject }),
    ...(youtubeMetadata &&
      recipe.youtubeUrl && {
        isBasedOn: {
          "@type": "VideoObject" as const,
          "@id": recipe.youtubeUrl,
          name: youtubeMetadata.videoTitle || `${recipe.title} 만들기`,
          url: recipe.youtubeUrl,
        },
      }),
    url: `${SEO_CONSTANTS.SITE_URL}recipes/${recipeId}`,
  };
};

// ────────────────────────────────────────────
// Landing page structured data
// ────────────────────────────────────────────

type LandingFAQEntry = {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
};

export const createLandingFAQStructuredData = () => {
  const mainEntity: LandingFAQEntry[] = [
    {
      "@type": "Question",
      name: "레시피오는 어떤 서비스인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "레시피오는 30,000개 이상의 홈쿡 레시피를 제공하는 서비스입니다. YouTube 링크를 붙여넣기만 하면 레시피로 자동 추출되고, AI가 상황과 재료에 맞게 레시피를 추천해줍니다.",
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
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  } as const;
};

export const createTagItemListStructuredData = (
  tags: Array<{ code: string; name: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: tags.map((tag, i) => ({
    "@type": "ListItem" as const,
    position: i + 1,
    name: tag.name,
    url: `${SEO_CONSTANTS.SITE_URL}/search/results?tags=${encodeURIComponent(
      tag.code
    )}`,
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
        url: `${SEO_CONSTANTS.SITE_URL}/recipes/${recipe.id}`,
        name: recipe.title,
        image: recipe.imageUrl,
      })),
    },
  ],
});
