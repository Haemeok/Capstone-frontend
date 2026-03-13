import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";
import { generateSeoPages } from "@/shared/config/seo/seoPages";

const SITE_URL = SEO_CONSTANTS.SITE_URL;

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [...staticRoutes];

  const seoPages = generateSeoPages();
  for (const page of seoPages) {
    const qs = new URLSearchParams(
      Object.entries(page.params).map(([k, v]) => [k, String(v)])
    ).toString();

    routes.push({
      url: `${SITE_URL}/search/results?${qs.replace(/&/g, "&amp;")}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return routes;
}
