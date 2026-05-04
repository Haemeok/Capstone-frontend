"use server";

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
