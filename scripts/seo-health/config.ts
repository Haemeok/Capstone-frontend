export const config = {
  baseUrl: "https://www.recipio.kr",
  apiBaseUrl: "https://api.recipio.kr",

  sitemapPaths: ["/sitemap/0.xml", "/recipes/sitemap/0.xml"],

  samplePages: [
    "/",
    "/recipes/category/CHEF_RECIPE",
    "/search/results?q=%EA%B9%80%EC%B9%98",
    "/search/results?q=%EB%8B%AD%EA%B0%80%EC%8A%B4%EC%82%B4",
  ],

  dynamicRecipeSampleCount: 3,
  randomSampleCount: 10,

  thresholds: {
    lighthouseSeo: 90,
    sitemapUrlDropPercent: 20,
  },

  request: {
    timeoutMs: 10_000,
    retries: 2,
    retryDelayMs: 1_000,
  },

  requiredOgTags: ["og:title", "og:description", "og:image", "og:url"] as const,

  requiredJsonLdFields: {
    WebSite: ["@type", "name", "url"],
    Recipe: ["@type", "name", "image", "author"],
  } as Record<string, string[]>,
} as const;
