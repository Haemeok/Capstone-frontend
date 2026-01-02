export const CACHE_TAGS = {
  recipe: (id: string) => `recipe-${id}`,

  recipesAll: "recipes-all",
  recipesPopular: "recipes-popular",
  recipesBudget: "recipes-budget",
  recipesRecommended: (id: string) => `recipes-recommended-${id}`,
  recipesSearch: (query: string) => `recipes-search-${query}`,
  recipesByCategory: (categoryId: number) => `recipes-category-${categoryId}`,

  userRecipes: (userId: string) => `user-${userId}-recipes`,
} as const;
