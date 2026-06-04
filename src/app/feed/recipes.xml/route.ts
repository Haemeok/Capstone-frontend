import {
  buildRssFeed,
  createRssResponse,
  type RssItem,
  tagUri,
} from "@/shared/lib/rss/buildFeed";

import { SEO_CONSTANTS } from "@/entities/recipe/lib/metadata/constants";
import { fetchRecentRecipesForFeed } from "@/entities/recipe/model/api.server";

export const revalidate = 21600;

const SITE_URL = SEO_CONSTANTS.SITE_URL;

export async function GET(request: Request) {
  const recipes = await fetchRecentRecipesForFeed(100);

  const items: RssItem[] = recipes.map((r) => ({
    guid: tagUri("recipe", r.id),
    title: r.title,
    link: `${SITE_URL}/recipes/${r.id}`,
    description: r.title,
    pubDate: new Date(r.createdAt),
    imageUrl: r.imageUrl || undefined,
  }));

  const xml = buildRssFeed(
    {
      title: `${SEO_CONSTANTS.SITE_NAME} – 레시피`,
      description: "레시피오의 최신 홈쿡 레시피",
      link: `${SITE_URL}/recipes`,
      selfUrl: `${SITE_URL}/feed/recipes.xml`,
      copyright: `© ${new Date().getFullYear()} ${SEO_CONSTANTS.SITE_NAME}`,
    },
    items
  );

  const lastModified = items[0]?.pubDate ?? new Date();
  return createRssResponse(request, xml, lastModified);
}
