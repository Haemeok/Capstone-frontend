import {
  buildSitemapIndexXml,
  XML_RESPONSE_HEADERS,
} from "@/shared/lib/sitemap/xml";

import {
  countNaverSitemapChunks,
  naverSitemapChunkUrl,
} from "@/entities/recipe/lib/naverSitemap";

export const revalidate = 604800;

export const GET = async (): Promise<Response> => {
  const chunkCount = await countNaverSitemapChunks();
  const locs = Array.from({ length: chunkCount }, (_, index) =>
    naverSitemapChunkUrl(index)
  );

  return new Response(buildSitemapIndexXml(locs), {
    headers: XML_RESPONSE_HEADERS,
  });
};
