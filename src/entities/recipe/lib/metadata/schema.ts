import type { StaticRecipe } from "@/entities/recipe/model/types";

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
