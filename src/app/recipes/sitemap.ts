import type { MetadataRoute } from "next";

import { fetchAllRecipesForSitemap } from "@/entities/recipe/model/api.server";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

const SITE_URL = SEO_CONSTANTS.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const recipes = await fetchAllRecipesForSitemap();
    return recipes.map((recipe) => ({
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
