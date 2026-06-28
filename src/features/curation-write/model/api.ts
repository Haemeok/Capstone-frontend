import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  PostCurationArticleRequest,
  PostCurationArticleResponse,
} from "./types";

export const postCurationArticle = (
  body: PostCurationArticleRequest
): Promise<PostCurationArticleResponse> =>
  api.post<PostCurationArticleResponse>(
    END_POINTS.ADMIN_CURATION_ARTICLES,
    body
  );

export const publishCurationArticle = (articleId: string): Promise<void> =>
  api.post<void>(END_POINTS.ADMIN_CURATION_ARTICLE_PUBLISH(articleId));
