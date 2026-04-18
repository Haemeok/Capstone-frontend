export const CACHE_TAGS = {
  recipe: (id: string) => `recipe-${id}`,

  recipesPopular: "recipes-popular",
  recipesBudget: "recipes-budget",
  recipesRecommended: (recipeId: string) => `recipes-recommended-${recipeId}`,
  recipesLatest: "recipes-latest",
  recipesTrending: "recipes-trending",
  recipesSitemap: "recipes-sitemap",
} as const;
