import type { MetadataRoute } from "next";

import { fetchAllRecipesForSitemap } from "@/entities/recipe/model/api.server";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import { generateSeoPages } from "@/shared/config/seo/seoPages";

const SITE_URL = SEO_CONSTANTS.SITE_URL;
const SITEMAP_CHUNK_SIZE = 5000;

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/search`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/recipes/my-fridge`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/ingredients`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  },
];

export async function generateSitemaps() {
  const seoPages = generateSeoPages();
  const searchChunks = Math.ceil(seoPages.length / SITEMAP_CHUNK_SIZE);

  return [
    { id: 0 }, // static routes
    { id: 1 }, // recipe routes
    ...Array.from({ length: searchChunks }, (_, i) => ({ id: i + 2 })), // search SEO pages
  ];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // id 0: static routes
  if (id === 0) {
    return staticRoutes;
  }

  // id 1: recipe detail pages
  if (id === 1) {
    try {
      const recipes = await fetchAllRecipesForSitemap();
      return recipes.map((recipe) => ({
        url: `${SITE_URL}/recipes/${recipe.id}`,
        lastModified: new Date(recipe.updatedAt),
        changeFrequency: "weekly",
        priority: 0.9,
      }));
    } catch (error) {
      console.error("[sitemap] Error generating recipe sitemap:", error);
      return [];
    }
  }

  // id 2+: search SEO pages (chunked)
  const chunkIndex = id - 2;
  const seoPages = generateSeoPages();
  const start = chunkIndex * SITEMAP_CHUNK_SIZE;
  const slice = seoPages.slice(start, start + SITEMAP_CHUNK_SIZE);

  return slice.map((page) => ({
    url: `${SITE_URL}/search/results?${new URLSearchParams(
      Object.entries(page.params).map(([k, v]) => [k, String(v)])
    ).toString()}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}
