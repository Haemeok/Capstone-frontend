"use client";

import { useCallback, useSyncExternalStore } from "react";

import { parseStoredArray } from "@/shared/lib/json/parseStoredArray";

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
const EMPTY: RecentRecipe[] = [];

let cached: RecentRecipe[] | null = null;
const listeners = new Set<() => void>();

const isRecentRecipe = (v: unknown): v is RecentRecipe =>
  typeof v === "object" &&
  v !== null &&
  typeof (v as Record<string, unknown>).id === "string" &&
  typeof (v as Record<string, unknown>).title === "string";

const readRecents = (): RecentRecipe[] => {
  try {
    return parseStoredArray(localStorage.getItem(STORAGE_KEY), isRecentRecipe);
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

const emit = () => {
  for (const listener of listeners) listener();
};

const setRecents = (next: RecentRecipe[]) => {
  cached = next;
  writeRecents(next);
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): RecentRecipe[] => {
  if (cached === null) cached = readRecents();
  return cached;
};

export const saveRecentlyViewedRecipe = (recipe: RecentRecipe) => {
  if (!recipe.id || !recipe.title) return;
  setRecents(mergeRecentRecipes(getSnapshot(), recipe));
};

export const useRecentlyViewedRecipes = () => {
  const recipes = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const addRecipe = useCallback((recipe: RecentRecipe) => {
    if (!recipe.id || !recipe.title) return;
    setRecents(mergeRecentRecipes(getSnapshot(), recipe));
  }, []);

  const removeRecipe = useCallback((recipeId: string) => {
    setRecents(getSnapshot().filter((r) => r.id !== recipeId));
  }, []);

  const clearAll = useCallback(() => {
    setRecents([]);
  }, []);

  return {
    recipes,
    addRecipe,
    removeRecipe,
    clearAll,
  };
};
