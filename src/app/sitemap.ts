import type { MetadataRoute } from "next";

import { fetchAllRecipesForSitemap } from "@/entities/recipe/model/api.server";
import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = SEO_CONSTANTS.SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}search`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}recipes/ai`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}recipes/my-fridge`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}ingredients`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  try {
    const recipes = await fetchAllRecipesForSitemap();

    const recipeRoutes: MetadataRoute.Sitemap = recipes.map((recipe) => ({
      url: `${SITE_URL}recipes/${recipe.id}`,
      lastModified: new Date(recipe.createdAt),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    return [...staticRoutes, ...recipeRoutes];
  } catch (error) {
    console.error("[sitemap] Error generating sitemap:", error);

    return staticRoutes;
  }
}
