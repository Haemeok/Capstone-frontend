import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";

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

const formatSubscriberCount = (count: number): string => {
  if (count >= 1000000) {
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

const createEnhancedVideoObject = (
  recipe: StaticRecipe,
  youtubeMetadata: YoutubeMetadata
) => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;

  return {
    "@type": "VideoObject" as const,
    name: youtubeMetadata.videoTitle || `${recipe.title} 만들기`,
    description: `${youtubeMetadata.channelName}의 ${recipe.title} 레시피 영상. ${recipe.description}`,
    thumbnailUrl: [
      youtubeMetadata.thumbnailUrl || recipe.imageUrl,
      recipe.imageUrl,
    ].filter(Boolean),
    contentUrl: recipe.youtubeUrl,
    embedUrl: recipe.youtubeUrl,
    uploadDate: recipe.createdAt || new Date().toISOString(),
    ...(recipe.cookingTime && { duration: `PT${recipe.cookingTime}M` }),
    publisher: {
      "@type": "Organization" as const,
      name: SEO_CONSTANTS.SITE_NAME,
      logo: {
        "@type": "ImageObject" as const,
        url: SEO_CONSTANTS.DEFAULT_IMAGE,
      },
    },
    creator: {
      "@type": "Person" as const,
      name: youtubeMetadata.channelName,
      ...(youtubeMetadata.channelProfileUrl && {
        image: youtubeMetadata.channelProfileUrl,
      }),
    },
    ...(subscriberCount > 0 && {
      interactionStatistic: {
        "@type": "InteractionCounter" as const,
        interactionType: "https://schema.org/SubscribeAction",
        userInteractionCount: subscriberCount,
      },
    }),
    keywords: [
      recipe.title,
      youtubeMetadata.channelName,
      "유튜브 레시피",
      "요리 영상",
      ...recipe.tags,
    ].join(", "),
  };
};

const createCreatorPersonSchema = (youtubeMetadata: YoutubeMetadata) => {
  const subscriberCount = youtubeMetadata.subscriberCount || 0;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: youtubeMetadata.channelName,
    ...(youtubeMetadata.channelProfileUrl && {
      image: youtubeMetadata.channelProfileUrl,
    }),
    jobTitle: "요리 크리에이터",
    ...(subscriberCount > 0 && {
      description: `구독자 ${formatSubscriberCount(subscriberCount)}의 인기 요리 유튜버`,
    }),
  };
};

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
    "@context": "https://schema.org",
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
        url: `${SEO_CONSTANTS.SITE_URL}recipes/${recipeId}#step-${index + 1}`,
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
