import type { Recipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";

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

export const createRecipeStructuredData = (recipe: Recipe, recipeId: string) => ({
  "@context": "https://schema.org",
  "@type": "Recipe",
  name: recipe.title,
  description: recipe.description,
  image: recipe.imageUrl,
  author: {
    "@type": "Person",
    name: recipe.author?.nickname || SEO_CONSTANTS.SITE_NAME,
  },
  ...(recipe.cookingTime && {
    cookTime: `PT${recipe.cookingTime}M`,
  }),
  ...(recipe.servings && {
    recipeYield: `${recipe.servings}인분`,
  }),
  recipeIngredient: recipe.ingredients?.map((ingredient) => ingredient.name) || [],
  recipeInstructions: recipe.steps?.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    text: step.instruction,
    ...(step.stepImageUrl && { image: step.stepImageUrl }),
  })) || [],
  ...(recipe.ratingInfo?.avgRating && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: recipe.ratingInfo.avgRating,
      ratingCount: recipe.ratingInfo.ratingCount,
      bestRating: 5,
    },
  }),
  ...(recipe.totalCalories && {
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.totalCalories} calories`,
    },
  }),
  datePublished: recipe.createdAt || new Date().toISOString(),
  recipeCategory: recipe.dishType,
  keywords: recipe.tagNames?.join(", "),
  url: `${SEO_CONSTANTS.SITE_URL}/recipes/${recipeId}`,
});