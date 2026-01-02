import { api } from "@/shared/api/client";
import { BaseQueryParams } from "@/shared/api/types";
import { END_POINTS } from "@/shared/config/constants/api";
import { PAGE_SIZE } from "@/shared/config/constants/api";

import {
  CommentsApiResponse,
  TotalRepliesApiResponse,
} from "@/entities/comment/model/types";

export const getComments = async ({
  pageParam = 0,
  sort,
  recipeId,
}: {
  pageParam: number;
  sort: string;
  recipeId: string;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,${sort}`,
  };

  const END_POINT = END_POINTS.RECIPE_COMMENT(recipeId);

  const response = await api.get<CommentsApiResponse>(END_POINT, {
    params: apiParams,
  });

  return response;
};

export const getReplies = async ({
  pageParam = 0,
  recipeId,
  commentId,
}: {
  pageParam: number;
  recipeId: string;
  commentId: string;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,desc`,
  };

  const END_POINT = END_POINTS.RECIPE_REPLY(recipeId, commentId);

  const response = await api.get<TotalRepliesApiResponse>(END_POINT, {
    params: apiParams,
  });

  return response;
};
