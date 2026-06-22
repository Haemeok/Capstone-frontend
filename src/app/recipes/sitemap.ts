import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { buildHreflangAlternates } from "@/shared/i18n";
import { localizedPath } from "@/shared/lib/metadata/localized";

import { fetchRecipeSitemapPage } from "@/entities/recipe/model/api.server";

const SITEMAP_CHUNK_SIZE = 10000;
const MAX_SITEMAP_CHUNKS = 50;

export async function generateSitemaps() {
  let count = 0;
  for (let page = 0; page < MAX_SITEMAP_CHUNKS; page++) {
    const recipes = await fetchRecipeSitemapPage(page, SITEMAP_CHUNK_SIZE);
    if (recipes.length === 0) break;
    count++;
    if (recipes.length < SITEMAP_CHUNK_SIZE) break;
  }
  if (count >= MAX_SITEMAP_CHUNKS) {
    console.warn("[recipes/sitemap] hit MAX_SITEMAP_CHUNKS cap");
  }
  return Array.from({ length: Math.max(count, 1) }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const recipes = await fetchRecipeSitemapPage(id, SITEMAP_CHUNK_SIZE);

  return recipes.map((recipe) => ({
    url: absoluteUrl(localizedPath("ko", `recipes/${recipe.id}`)),
    lastModified: new Date(recipe.updatedAt),
    changeFrequency: "weekly",
    priority: 0.9,
    alternates: { languages: buildHreflangAlternates(`recipes/${recipe.id}`) },
  }));
}
