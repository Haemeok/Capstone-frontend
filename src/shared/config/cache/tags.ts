export const CACHE_TAGS = {
  recipe: (id: string) => `recipe-${id}`,

  recipesPopular: "recipes-popular",
  recipesBudget: "recipes-budget",
  recipesRecommended: (recipeId: string) => `recipes-recommended-${recipeId}`,
  recipesTrending: "recipes-trending",
  recipesDiscovery: (kind: string) => `recipes-discovery-${kind}`,
  recipesDetailSlide: (kind: string, recipeId: string) =>
    `recipes-${kind}-${recipeId}`,
  recipesSitemap: "recipes-sitemap",
  recipesSitemapJa: "recipes-sitemap-ja",
  recipesSitemapEn: "recipes-sitemap-en",
  recipesSitemapNaver: "recipes-sitemap-naver",
  ingredientDetail: (id: string) => `ingredient-${id}`,
  ingredientsSitemap: "ingredients-sitemap",
  curationArticlesSitemap: "curation-articles-sitemap",
  recipesFeed: "recipes-feed",
  curationFeed: "curation-feed",
} as const;
