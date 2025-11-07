import { create } from "zustand";

type RecipeCompleteStore = {
  completedRecipeIds: Set<number>;
  addCompletedRecipe: (recipeId: number) => void;
  hasCompletedRecipe: (recipeId: number) => boolean;
  clearCompletedRecipes: () => void;
};

export const useRecipeCompleteStore = create<RecipeCompleteStore>((set, get) => ({
  completedRecipeIds: new Set<number>(),

  addCompletedRecipe: (recipeId) => {
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
    set({ completedRecipeIds: new Set<number>() });
  },
}));
