import { absoluteUrl } from "@/shared/config/constants/api";

import { fetchNaverRecipeSitemapPage } from "../model/api.server";

export const NAVER_SITEMAP_CHUNK_SIZE = 20000;
export const NAVER_SITEMAP_MAX_CHUNKS = 50;

export const naverSitemapChunkUrl = (index: number): string =>
  absoluteUrl(`naver-sitemap/${index}.xml`);

export const fetchNaverSitemapChunk = (index: number) =>
  fetchNaverRecipeSitemapPage(index, NAVER_SITEMAP_CHUNK_SIZE);

export const countNaverSitemapChunks = async (): Promise<number> => {
  let count = 0;

  for (let index = 0; index < NAVER_SITEMAP_MAX_CHUNKS; index++) {
    const chunk = await fetchNaverSitemapChunk(index);
    if (chunk.length === 0) break;
    count++;
    if (chunk.length < NAVER_SITEMAP_CHUNK_SIZE) break;
  }

  if (count >= NAVER_SITEMAP_MAX_CHUNKS) {
    console.warn("[naver-sitemap] hit NAVER_SITEMAP_MAX_CHUNKS cap");
  }

  return count;
};
