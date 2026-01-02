export const STORAGE_KEYS = {
  AI_RECENT_RECIPES: "ai_recent_recipes",
  AI_CREDIT_PROMPTED: "ai_credit_prompted",
} as const;

export const MAX_RECENT_AI_RECIPES = 10;

export type AIRecentRecipeItem = {
  recipeId: string;
  aiModelId: string;
  timestamp: number;
  title: string;
  imageUrl: string;
  authorName: string;
  authorId: string;
  profileImage: string;
  cookingTime?: number;
  createdAt: string;
};

export const getRecentAIRecipes = (): AIRecentRecipeItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AI_RECENT_RECIPES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addRecentAIRecipe = (data: AIRecentRecipeItem) => {
  if (typeof window === "undefined") return;

  const recent = getRecentAIRecipes();
  const filtered = recent.filter((item) => item.recipeId !== data.recipeId);
  const updated = [data, ...filtered].slice(0, MAX_RECENT_AI_RECIPES);

  localStorage.setItem(STORAGE_KEYS.AI_RECENT_RECIPES, JSON.stringify(updated));
};
