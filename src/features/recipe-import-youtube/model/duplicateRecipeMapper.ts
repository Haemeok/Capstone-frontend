import type { DetailedRecipeGridItem as DetailedRecipeGridItemType, Recipe } from "@/entities/recipe/model/types";

import { YoutubeMeta } from "./types";

export const toDetailedRecipeItem = (
  recipeData: Recipe,
  youtubeMeta?: YoutubeMeta
): DetailedRecipeGridItemType => {
  const channelName =
    youtubeMeta?.channelName ?? recipeData.youtubeChannelName;

  return {
    id: recipeData.id,
    title: recipeData.title,
    imageUrl: recipeData.imageUrl,
    authorName: recipeData.author.nickname,
    authorId: recipeData.author.id,
    profileImage: recipeData.author.profileImage,
    cookingTime: recipeData.cookingTime,
    createdAt: recipeData.createdAt ?? "",
    favoriteByCurrentUser: recipeData.favoriteByCurrentUser,
    avgRating: recipeData.ratingInfo.avgRating,
    ratingCount: recipeData.ratingInfo.ratingCount,
    marketPrice: recipeData.marketPrice,
    ingredientCost: recipeData.totalIngredientCost,
    source: "YOUTUBE",
    youtubeChannelName: channelName,
  };
};
