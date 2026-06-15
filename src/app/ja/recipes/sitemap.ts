import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";

import { fetchJaRecipesForSitemap } from "@/entities/recipe/model/api.server";

const SITEMAP_CHUNK_SIZE = 10000;

export async function generateSitemaps() {
  try {
    const recipes = await fetchJaRecipesForSitemap();
    const count = Math.ceil(recipes.length / SITEMAP_CHUNK_SIZE);
    return Array.from({ length: Math.max(count, 1) }, (_, i) => ({ id: i }));
  } catch {
    return [{ id: 0 }];
  }
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  try {
    const id = Number(await props.id);
    const recipes = await fetchJaRecipesForSitemap();
    const start = id * SITEMAP_CHUNK_SIZE;
    const chunk = recipes.slice(start, start + SITEMAP_CHUNK_SIZE);

    return chunk.map((recipe) => ({
      url: absoluteUrl(`ja/recipes/${recipe.id}`),
      lastModified: new Date(recipe.updatedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    }));
  } catch (error) {
    console.error("[ja/recipes/sitemap] Error fetching recipes:", error);
    return [];
  }
}
