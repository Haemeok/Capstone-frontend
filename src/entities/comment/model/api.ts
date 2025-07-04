import { axiosInstance } from "@/shared/api/axios";
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
  recipeId: number;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,${sort}`,
  };

  const END_POINT = END_POINTS.RECIPE_COMMENT(recipeId);

  const response = await axiosInstance.get<CommentsApiResponse>(END_POINT, {
    params: apiParams,
    useAuth: "optional",
  });

  return response.data;
};

export const getReplies = async ({
  pageParam = 0,
  recipeId,
  commentId,
}: {
  pageParam: number;
  recipeId: number;
  commentId: number;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,desc`,
  };

  const END_POINT = END_POINTS.RECIPE_REPLY(recipeId, commentId);

  const response = await axiosInstance.get<TotalRepliesApiResponse>(END_POINT, {
    params: apiParams,
    useAuth: "optional",
  });

  console.log("response", response.data);
  return response.data;
};
