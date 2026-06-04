import {
  buildRssFeed,
  createRssResponse,
  type RssItem,
  tagUri,
} from "@/shared/lib/rss/buildFeed";

import { SEO_CONSTANTS } from "@/entities/recipe/lib/metadata/constants";
import { fetchRecentRecipesForFeed } from "@/entities/recipe/model/api.server";

import {
  coverImageUrlFromKey,
  fetchRecentCurationForFeed,
} from "@/features/curation";

export const revalidate = 21600;

const SITE_URL = SEO_CONSTANTS.SITE_URL;

export async function GET(request: Request) {
  const [recipes, curations] = await Promise.all([
    fetchRecentRecipesForFeed(30),
    fetchRecentCurationForFeed(20),
  ]);

  const recipeItems: RssItem[] = recipes.map((r) => ({
    guid: tagUri("recipe", r.id),
    title: r.title,
    link: `${SITE_URL}/recipes/${r.id}`,
    description: r.title,
    pubDate: new Date(r.createdAt),
    imageUrl: r.imageUrl || undefined,
  }));

  const curationItems: RssItem[] = curations.map((c) => ({
    guid: tagUri("curation", c.slug),
    title: c.title,
    link: `${SITE_URL}/curation/${c.slug}`,
    description: c.description ?? c.title,
    pubDate: new Date(c.publishedAt),
    imageUrl: coverImageUrlFromKey(c.coverImageKey) ?? undefined,
  }));

  const items = [...recipeItems, ...curationItems]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 50);

  const xml = buildRssFeed(
    {
      title: SEO_CONSTANTS.SITE_NAME,
      description: SEO_CONSTANTS.SITE_DESCRIPTION,
      link: SITE_URL,
      selfUrl: `${SITE_URL}/feed.xml`,
      copyright: `© ${new Date().getFullYear()} ${SEO_CONSTANTS.SITE_NAME}`,
    },
    items
  );

  const lastModified = items[0]?.pubDate ?? new Date();
  return createRssResponse(request, xml, lastModified);
}
