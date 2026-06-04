export const CACHE_TAGS = {
  recipe: (id: string) => `recipe-${id}`,

  recipesPopular: "recipes-popular",
  recipesBudget: "recipes-budget",
  recipesRecommended: (recipeId: string) => `recipes-recommended-${recipeId}`,
  recipesTrending: "recipes-trending",
  recipesSitemap: "recipes-sitemap",
  curationArticlesSitemap: "curation-articles-sitemap",
  recipesFeed: "recipes-feed",
  curationFeed: "curation-feed",
} as const;
