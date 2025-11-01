import type { MetadataRoute } from "next";

import { BASE_API_URL } from "@/shared/config/constants/api";

const SITEMAP_MAX_RECIPES = 1000;

async function getRecipeIds(): Promise<number[]> {
  try {
    const res = await fetch(
      `${BASE_API_URL}/recipes/search?page=0&size=${SITEMAP_MAX_RECIPES}&sort=createdAt,desc`,
      {
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch recipes for sitemap");
      return [];
    }

    const data = await res.json();
    return data.content?.map((recipe: any) => recipe.id) || [];
  } catch (error) {
    console.error("Error fetching recipes for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipeIds = await getRecipeIds();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://www.recipio.kr/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.recipio.kr/search",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.recipio.kr/ai-recipe",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.recipio.kr/ai-recipes",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipeIds.map((id) => ({
    url: `https://www.recipio.kr/recipes/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...recipeRoutes];
}
