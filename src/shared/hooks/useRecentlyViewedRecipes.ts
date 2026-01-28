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
  youtubeVideoViewCount?: number;
  favoriteCount?: number;
};

const STORAGE_KEY = "recently-viewed-recipes";
const MAX_ITEMS = 20;

let cachedRecipes: RecentRecipe[] | null = null;

// 훅 외부에서 사용 가능한 저장 함수
export const saveRecentlyViewedRecipe = (recipe: RecentRecipe) => {
  if (!recipe.id || !recipe.title) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const recipes: RecentRecipe[] = stored ? JSON.parse(stored) : [];

    // 기존 데이터와 merge
    const existing = recipes.find((r) => r.id === recipe.id);
    const merged: RecentRecipe = existing
      ? {
          ...existing,
          ...Object.fromEntries(
            Object.entries(recipe).filter(([, v]) => v !== undefined)
          ),
        }
      : recipe;

    const filtered = recipes.filter((r) => r.id !== recipe.id);
    const newRecipes = [merged, ...filtered].slice(0, MAX_ITEMS);

    cachedRecipes = newRecipes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
  } catch {
    // localStorage 에러 무시
  }
};

export const useRecentlyViewedRecipes = () => {
  const [recipes, setRecipes] = useState<RecentRecipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (cachedRecipes !== null) {
      setRecipes(cachedRecipes);
      setIsLoaded(true);
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      cachedRecipes = parsed;
      setRecipes(parsed);
    } catch {
      cachedRecipes = [];
      setRecipes([]);
    }
    setIsLoaded(true);
  }, []);

  const addRecipe = useCallback((recipe: RecentRecipe) => {
    if (!recipe.id || !recipe.title) return;

    setRecipes((prev) => {
      const existing = prev.find((r) => r.id === recipe.id);
      const merged: RecentRecipe = existing
        ? {
            ...existing,
            ...Object.fromEntries(
              Object.entries(recipe).filter(([, v]) => v !== undefined)
            ),
          }
        : recipe;

      const filtered = prev.filter((r) => r.id !== recipe.id);
      const newRecipes = [merged, ...filtered].slice(0, MAX_ITEMS);

      cachedRecipes = newRecipes;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
      } catch {
        // ignore
      }

      return newRecipes;
    });
  }, []);

  const removeRecipe = useCallback((recipeId: string) => {
    setRecipes((prev) => {
      const newRecipes = prev.filter((r) => r.id !== recipeId);

      cachedRecipes = newRecipes;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
      } catch {
        // ignore
      }

      return newRecipes;
    });
  }, []);

  const clearAll = useCallback(() => {
    cachedRecipes = [];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
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
