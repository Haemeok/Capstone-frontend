import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

const SITE_URL = SEO_CONSTANTS.SITE_URL;
const SITEMAP_CHUNK_SIZE = 10000;

// allowlist = source of truth
let allowlistPages: Array<Record<string, string | number>> = [];
try {
  const allowlist = require("@/shared/config/seo/sitemap-allowlist.json");
  allowlistPages = allowlist.pages || [];
} catch {
  // allowlist 없으면 빈 배열
}

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

let _cachedRoutes: MetadataRoute.Sitemap | null = null;

const buildAllRoutes = (): MetadataRoute.Sitemap => {
  if (_cachedRoutes) return _cachedRoutes;

  const routes: MetadataRoute.Sitemap = [...staticRoutes];

  for (const params of allowlistPages) {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();

    routes.push({
      url: `${SITE_URL}/search/results?${qs.replace(/&/g, "&amp;")}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  _cachedRoutes = routes;
  return routes;
};

export async function generateSitemaps() {
  const total = staticRoutes.length + allowlistPages.length;
  const count = Math.ceil(total / SITEMAP_CHUNK_SIZE);
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const allRoutes = buildAllRoutes();
  const start = id * SITEMAP_CHUNK_SIZE;
  return allRoutes.slice(start, start + SITEMAP_CHUNK_SIZE);
}
