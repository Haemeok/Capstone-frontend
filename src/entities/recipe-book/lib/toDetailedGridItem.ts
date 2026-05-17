import type { DetailedRecipeGridItem } from "@/entities/recipe/model/types";

import type { BookRecipe } from "../api/types";

export const toDetailedGridItem = (
  recipe: BookRecipe
): DetailedRecipeGridItem => ({
  id: recipe.recipeId,
  title: recipe.title,
  imageUrl: recipe.imageUrl,
  authorId: recipe.authorId,
  authorName: recipe.authorName,
  profileImage: recipe.profileImage,
  createdAt: recipe.createdAt,
  cookingTime: recipe.cookingTime,
  favoriteCount: recipe.favoriteCount,
  youtubeVideoViewCount: recipe.youtubeVideoViewCount,
  youtubeChannelName: recipe.youtubeChannelName ?? undefined,
  visibility: recipe.visibility ?? undefined,
  source: recipe.source ?? undefined,
  avgRating: 0,
  ratingCount: 0,
  favoriteByCurrentUser: false,
});
