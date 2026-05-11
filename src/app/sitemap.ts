import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

const SITE_URL = SEO_CONSTANTS.SITE_URL;

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
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
  return [{ id: 0 }];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return staticRoutes;
}
