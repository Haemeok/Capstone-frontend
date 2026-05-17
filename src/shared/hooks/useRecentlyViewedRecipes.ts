"use client";

import { useCallback, useEffect, useState } from "react";

export type RecentRecipe = {
  id: string;
  title: string;
  imageUrl: string;
  authorName: string;
  authorId: string;
  profileImage: string;
  cookingTime?: number;
  avgRating?: number;
  ratingCount?: number;
  isYoutube?: boolean;
  youtubeChannelName?: string;
  youtubeVideoViewCount?: number;
  favoriteCount?: number;
  isAiGenerated?: boolean;
};

const STORAGE_KEY = "recently-viewed-recipes";
const MAX_ITEMS = 20;

const readRecents = (): RecentRecipe[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as RecentRecipe[]) : [];
  } catch {
    return [];
  }
};

const writeRecents = (list: RecentRecipe[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage 에러 무시
  }
};

const mergeRecentRecipes = (
  prev: RecentRecipe[],
  incoming: RecentRecipe
): RecentRecipe[] => {
  const existing = prev.find((r) => r.id === incoming.id);
  const merged: RecentRecipe = existing
    ? {
        ...existing,
        ...Object.fromEntries(
          Object.entries(incoming).filter(([, v]) => v !== undefined)
        ),
      }
    : incoming;

  const filtered = prev.filter((r) => r.id !== incoming.id);
  return [merged, ...filtered].slice(0, MAX_ITEMS);
};

// 훅 외부에서 사용 가능한 저장 함수
export const saveRecentlyViewedRecipe = (recipe: RecentRecipe) => {
  if (!recipe.id || !recipe.title) return;
  writeRecents(mergeRecentRecipes(readRecents(), recipe));
};

export const useRecentlyViewedRecipes = () => {
  const [recipes, setRecipes] = useState<RecentRecipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRecipes(readRecents());
    setIsLoaded(true);
  }, []);

  const addRecipe = useCallback((recipe: RecentRecipe) => {
    if (!recipe.id || !recipe.title) return;

    setRecipes((prev) => {
      const next = mergeRecentRecipes(prev, recipe);
      writeRecents(next);
      return next;
    });
  }, []);

  const removeRecipe = useCallback((recipeId: string) => {
    setRecipes((prev) => {
      const next = prev.filter((r) => r.id !== recipeId);
      writeRecents(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeRecents([]);
    setRecipes([]);
  }, []);

  return {
    recipes,
    isLoaded,
    addRecipe,
    removeRecipe,
    clearAll,
  };
};
