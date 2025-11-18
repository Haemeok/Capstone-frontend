import type { MetadataRoute } from "next";

import { SEO_CONSTANTS } from "@/shared/lib/metadata/constants";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = SEO_CONSTANTS.SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/static/",
          "/login",
          "/login/error",
          "/users/edit",
          "/recipes/new",
          "/recipes/*/edit",
          "/recipes/*/rate",
          "/recipes/*/comments",
          "/notifications",
          "/calendar/*",
          "/ingredients/new",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
      {
        userAgent: "Yeti",
        allow: "/",
        crawlDelay: 0,
      },
    ],
    sitemap: `${SITE_URL}sitemap.xml`,
  };
}
