import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/shared/config/constants/api";
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
    url: absoluteUrl("ingredients"),
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
