import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
import { buildHreflangAlternates } from "@/shared/i18n";
import { localizedPath } from "@/shared/lib/metadata/localized";

import { fetchAllIngredientsForSitemap } from "@/entities/ingredient/model/api.server";

const SITEMAP_CHUNK_SIZE = 10000;

export async function generateSitemaps() {
  try {
    const ingredients = await fetchAllIngredientsForSitemap();
    const count = Math.ceil(ingredients.length / SITEMAP_CHUNK_SIZE);
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
    const ingredients = await fetchAllIngredientsForSitemap();
    const start = id * SITEMAP_CHUNK_SIZE;
    const chunk = ingredients.slice(start, start + SITEMAP_CHUNK_SIZE);

    return chunk.map((ingredient) => ({
      url: absoluteUrl(localizedPath("ja", `ingredients/${ingredient.id}`)),
      lastModified: new Date(ingredient.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: buildHreflangAlternates(`ingredients/${ingredient.id}`),
      },
    }));
  } catch (error) {
    console.error(
      "[ja/ingredients/sitemap] Error fetching ingredients:",
      error
    );
    return [];
  }
}
