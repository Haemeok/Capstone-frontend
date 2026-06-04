import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

import { fetchAllCurationArticlesForSitemap } from "@/features/curation";

const SITE_URL = SEO_CONSTANTS.SITE_URL;
const SITEMAP_CHUNK_SIZE = 10000;

export async function generateSitemaps() {
  try {
    const articles = await fetchAllCurationArticlesForSitemap();
    const count = Math.ceil(articles.length / SITEMAP_CHUNK_SIZE);
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
    const articles = await fetchAllCurationArticlesForSitemap();
    const start = id * SITEMAP_CHUNK_SIZE;
    const chunk = articles.slice(start, start + SITEMAP_CHUNK_SIZE);

    return chunk.map((article) => ({
      url: `${SITE_URL}/curation/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error(
      "[curation/sitemap] Error fetching curation articles:",
      error
    );
    return [];
  }
}
