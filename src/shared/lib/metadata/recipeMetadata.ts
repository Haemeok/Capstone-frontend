import type { Metadata } from "next";

import type { StaticRecipe } from "@/entities/recipe/model/types";

import { SEO_CONSTANTS } from "./constants";
import { createRecipeStructuredData } from "./structuredData";

export const generateRecipeMetadata = (
  recipe: StaticRecipe,
  recipeId: string
): Metadata => {
  const title = `${recipe.title} - ${SEO_CONSTANTS.SITE_NAME}`;
  const description =
    recipe.description || `${recipe.title} 레시피를 확인해보세요!`;
  const imageUrl = recipe.imageUrl;
  const recipeUrl = `${SEO_CONSTANTS.SITE_URL}/recipes/${recipeId}`;

  return {
    title,
    description,
    keywords: [...SEO_CONSTANTS.DEFAULT_KEYWORDS, recipe.title],
    alternates: {
      canonical: recipeUrl,
    },
    openGraph: {
      title,
      description,
      url: recipeUrl,
      type: SEO_CONSTANTS.OG_TYPE.ARTICLE,
      locale: SEO_CONSTANTS.LOCALE,
      ...(imageUrl && {
        images: [{ url: imageUrl, alt: recipe.title }],
      }),
    },
    twitter: {
      card: SEO_CONSTANTS.TWITTER_CARD,
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
    other: {
      "application/ld+json": JSON.stringify(
        createRecipeStructuredData(recipe, recipeId)
      ),
    },
  };
};

export const generateNotFoundRecipeMetadata = (): Metadata => ({
  title: `레시피를 찾을 수 없습니다 - ${SEO_CONSTANTS.SITE_NAME}`,
  description: "요청하신 레시피를 찾을 수 없습니다.",
});
