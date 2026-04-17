import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

import { fetchAllRecipesForSitemap } from "@/entities/recipe/model/api.server";

const SITE_URL = SEO_CONSTANTS.SITE_URL;
const SITEMAP_CHUNK_SIZE = 10000;

export async function generateSitemaps() {
  try {
    const recipes = await fetchAllRecipesForSitemap();
    const count = Math.ceil(recipes.length / SITEMAP_CHUNK_SIZE);
    return Array.from({ length: count }, (_, i) => ({ id: i }));
  } catch {
    return [{ id: 0 }];
  }
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  try {
    const id = Number(await props.id);
    const recipes = await fetchAllRecipesForSitemap();
    const start = id * SITEMAP_CHUNK_SIZE;
    const chunk = recipes.slice(start, start + SITEMAP_CHUNK_SIZE);

    return chunk.map((recipe) => ({
      url: `${SITE_URL}/recipes/${recipe.id}`,
      lastModified: new Date(recipe.updatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (error) {
    console.error("[sitemap] Error fetching recipes:", error);
    return [];
  }
}
