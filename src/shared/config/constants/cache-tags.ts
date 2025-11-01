export const CACHE_TAGS = {
  recipe: (id: number) => `recipe-${id}`,

  recipesAll: "recipes-all",
  recipesPopular: "recipes-popular",
  recipesBudget: "recipes-budget",
  recipesSearch: (query: string) => `recipes-search-${query}`,
  recipesByCategory: (categoryId: number) => `recipes-category-${categoryId}`,

  userRecipes: (userId: number) => `user-${userId}-recipes`,
} as const;
