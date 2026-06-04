import {
  buildRssFeed,
  createRssResponse,
  type RssItem,
  tagUri,
} from "@/shared/lib/rss/buildFeed";

import { SEO_CONSTANTS } from "@/entities/recipe/lib/metadata/constants";

import {
  coverImageUrlFromKey,
  fetchRecentCurationForFeed,
} from "@/features/curation";

export const revalidate = 21600;

const SITE_URL = SEO_CONSTANTS.SITE_URL;

export async function GET(request: Request) {
  const curations = await fetchRecentCurationForFeed(50);

  const items: RssItem[] = curations.map((c) => ({
    guid: tagUri("curation", c.slug),
    title: c.title,
    link: `${SITE_URL}/curation/${c.slug}`,
    description: c.description ?? c.title,
    pubDate: new Date(c.publishedAt),
    imageUrl: coverImageUrlFromKey(c.coverImageKey) ?? undefined,
  }));

  const xml = buildRssFeed(
    {
      title: `${SEO_CONSTANTS.SITE_NAME} – 큐레이션`,
      description: "레시피오의 최신 큐레이션 아티클",
      link: `${SITE_URL}/curation`,
      selfUrl: `${SITE_URL}/feed/curation.xml`,
      copyright: `© ${new Date().getFullYear()} ${SEO_CONSTANTS.SITE_NAME}`,
    },
    items
  );

  const lastModified = items[0]?.pubDate ?? new Date();
  return createRssResponse(request, xml, lastModified);
}
