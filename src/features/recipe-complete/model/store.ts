import { create } from "zustand";

import {
  loadCompletedRecipes,
  addCompletedRecipeRecord,
  clearCompletedRecipes as clearPersistedRecipes,
} from "./persistence";

type RecipeCompleteStore = {
  completedRecipeIds: Set<string>;
  isHydrated: boolean;
  addCompletedRecipe: (recipeId: string) => void;
  hasCompletedRecipe: (recipeId: string) => boolean;
  clearCompletedRecipes: () => void;
  hydrateFromStorage: () => void;
};

export const useRecipeCompleteStore = create<RecipeCompleteStore>((set, get) => ({
  completedRecipeIds: new Set<string>(),
  isHydrated: false,

  addCompletedRecipe: (recipeId) => {
    // localStorage에 저장
    addCompletedRecipeRecord(recipeId);

    // 메모리 Set 업데이트
    set((state) => {
      const newSet = new Set(state.completedRecipeIds);
      newSet.add(recipeId);
      return { completedRecipeIds: newSet };
    });
  },

  hasCompletedRecipe: (recipeId) => {
    return get().completedRecipeIds.has(recipeId);
  },

  clearCompletedRecipes: () => {
    clearPersistedRecipes();
    set({ completedRecipeIds: new Set<string>() });
  },

  hydrateFromStorage: () => {
    const records = loadCompletedRecipes();
    const recipeIds = new Set(records.map((r) => r.recipeId));
    set({ completedRecipeIds: recipeIds, isHydrated: true });
  },
}));
