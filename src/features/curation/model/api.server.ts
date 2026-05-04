"use server";

import type { PageResponse } from "@/shared/api/types";
import { BASE_API_URL, END_POINTS } from "@/shared/config/constants/api";
import { captureException } from "@/shared/lib/sentry";

export type PublicCurationArticleDto = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageKey: string | null;
  contentMdx: string;
  category: string | null;
  publishedAt: string;
  recipeIds: string[];
};

export const fetchCurationArticle = async (
  slug: string,
): Promise<PublicCurationArticleDto | null> => {
  const url = `${BASE_API_URL}${END_POINTS.CURATION_ARTICLE(slug)}`;
  try {
    const res = await fetch(url, {
      next: { tags: [`curation:${slug}`] },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(`fetchCurationArticle ${res.status}`);
    }
    return (await res.json()) as PublicCurationArticleDto;
  } catch (e) {
    captureException(e);
    return null;
  }
};

export type PublicCurationArticleListItemDto = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImageKey: string | null;
  category: string | null;
  publishedAt: string;
};

export type CurationArticleListResponse =
  PageResponse<PublicCurationArticleListItemDto>;

export type CurationArticleListParams = {
  category?: string;
  page?: number;
  size?: number;
};

const buildListUrl = (params: CurationArticleListParams): string => {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  const qs = search.toString();
  return `${BASE_API_URL}${END_POINTS.CURATION_ARTICLES}${qs ? `?${qs}` : ""}`;
};

export const fetchCurationArticleList = async (
  params: CurationArticleListParams,
): Promise<CurationArticleListResponse> => {
  const url = buildListUrl(params);
  try {
    const res = await fetch(url, {
      next: {
        tags: ["curation:list"],
        revalidate: 30 * 60,
      },
    });
    if (!res.ok) {
      throw new Error(`fetchCurationArticleList ${res.status}`);
    }
    return (await res.json()) as CurationArticleListResponse;
  } catch (e) {
    captureException(e);
    return {
      content: [],
      page: {
        size: params.size ?? 20,
        number: params.page ?? 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }
};
