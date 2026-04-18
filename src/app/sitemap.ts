import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

const SITE_URL = SEO_CONSTANTS.SITE_URL;
const SITEMAP_CHUNK_SIZE = 10000;
const ALLOWLIST_URL =
  "https://haemeok-s3-bucket.s3.ap-northeast-2.amazonaws.com/seo/allowlist.json";
const ALLOWLIST_REVALIDATE_SECONDS = 3600;

type AllowlistPage = Record<string, string | number>;

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

const fetchAllowlistPages = async (): Promise<AllowlistPage[]> => {
  try {
    const res = await fetch(ALLOWLIST_URL, {
      next: { revalidate: ALLOWLIST_REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { pages?: AllowlistPage[] };
    return data.pages ?? [];
  } catch {
    return [];
  }
};

const buildAllRoutes = async (): Promise<MetadataRoute.Sitemap> => {
  const allowlistPages = await fetchAllowlistPages();
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

  return routes;
};

export async function generateSitemaps() {
  const allowlistPages = await fetchAllowlistPages();
  const total = staticRoutes.length + allowlistPages.length;
  const count = Math.ceil(total / SITEMAP_CHUNK_SIZE);
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const allRoutes = await buildAllRoutes();
  const start = id * SITEMAP_CHUNK_SIZE;
  return allRoutes.slice(start, start + SITEMAP_CHUNK_SIZE);
}
