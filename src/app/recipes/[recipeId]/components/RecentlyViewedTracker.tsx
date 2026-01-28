"use client";

import { useEffect } from "react";

import { useRecentlyViewedRecipes } from "@/shared/hooks/useRecentlyViewedRecipes";

type RecentlyViewedTrackerProps = {
  recipeId: string;
  title: string;
  imageUrl: string | null;
  authorName: string;
  authorId: string;
  profileImage: string;
  cookingTime?: number;
  avgRating?: number;
  ratingCount?: number;
  isYoutube?: boolean;
  youtubeVideoViewCount?: number;
  favoriteCount?: number;
};

const RecentlyViewedTracker = ({
  recipeId,
  title,
  imageUrl,
  authorName,
  authorId,
  profileImage,
  cookingTime,
  avgRating,
  ratingCount,
  isYoutube,
  youtubeVideoViewCount,
  favoriteCount,
}: RecentlyViewedTrackerProps) => {
  const { addRecipe } = useRecentlyViewedRecipes();

  useEffect(() => {
    if (recipeId && title) {
      addRecipe({
        id: recipeId,
        title,
        imageUrl: imageUrl || "",
        authorName,
        authorId,
        profileImage,
        cookingTime,
        avgRating,
        ratingCount,
        isYoutube,
        youtubeVideoViewCount,
        favoriteCount,
      });
    }
    // addRecipe is stable (no dependencies), only run when recipeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  return null;
};

export default RecentlyViewedTracker;
