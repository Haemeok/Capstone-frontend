import { absoluteUrl } from "@/shared/config/constants/api";
import { buildUrlsetXml, XML_RESPONSE_HEADERS } from "@/shared/lib/sitemap/xml";

import {
  fetchNaverSitemapChunk,
  NAVER_SITEMAP_MAX_CHUNKS,
} from "@/entities/recipe/lib/naverSitemap";

export const revalidate = 604800;

const parseChunkIndex = (id: string): number | null => {
  const match = /^(\d+)\.xml$/.exec(id);
  if (!match) return null;

  const index = Number(match[1]);
  return index < NAVER_SITEMAP_MAX_CHUNKS ? index : null;
};

export const GET = async (
  _request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const { id } = await context.params;
  const index = parseChunkIndex(id);

  if (index === null) {
    return new Response("Not Found", { status: 404 });
  }

  const recipes = await fetchNaverSitemapChunk(index);
  const xml = buildUrlsetXml(
    recipes.map((recipe) => ({
      loc: absoluteUrl(`recipes/${recipe.id}`),
      lastModified: recipe.updatedAt,
    }))
  );

  return new Response(xml, { headers: XML_RESPONSE_HEADERS });
};
