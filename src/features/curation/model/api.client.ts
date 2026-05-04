import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  CurationArticleListParams,
  CurationArticleListResponse,
} from "./api.server";

export const getCurationArticles = async (
  params: CurationArticleListParams,
): Promise<CurationArticleListResponse> => {
  return api.get<CurationArticleListResponse>(END_POINTS.CURATION_ARTICLES, {
    params: {
      ...(params.category ? { category: params.category } : {}),
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  });
};
