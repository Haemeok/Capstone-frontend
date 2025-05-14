import { END_POINTS, PAGE_SIZE } from '@/constants/api';
import { BaseQueryParams, PageResponse } from '@/type/query';
import { Comment } from '@/type/comment';
import { axiosInstance } from './axios';

export type CommentsApiResponse = PageResponse<Comment>;

export const getComments = async ({
  pageParam = 0,
  sort,
  recipeId,
  commentId,
}: {
  pageParam: number;
  sort: string;
  recipeId: number;
  commentId?: number;
}) => {
  const apiParams: BaseQueryParams = {
    page: pageParam,
    size: PAGE_SIZE,
    sort: `createdAt,${sort}`,
  };

  const END_POINT = commentId
    ? END_POINTS.RECIPE_REPLY(recipeId, commentId)
    : END_POINTS.RECIPE_COMMENT(recipeId);

  const response = await axiosInstance.get<CommentsApiResponse>(END_POINT, {
    params: apiParams,
    useAuth: 'optional',
  });

  return response.data;
};

export type PostCommentParams = {
  recipeId: number;
  commentId?: number;
  comment: string;
  userId: number;
};

export const postComment = async ({
  recipeId,
  commentId,
  comment,
  userId,
}: PostCommentParams): Promise<Comment> => {
  const END_POINT = commentId
    ? END_POINTS.RECIPE_REPLY(recipeId, commentId)
    : END_POINTS.RECIPE_COMMENT(recipeId);

  const response = await axiosInstance.post<Comment>(END_POINT, {
    content: comment,
    userId,
  });
  return response.data;
};

export const deleteComment = async ({
  recipeId,
  commentId,
}: {
  recipeId: number;
  commentId: number;
}) => {
  const END_POINT = commentId
    ? END_POINTS.RECIPE_REPLY(recipeId, commentId)
    : END_POINTS.RECIPE_COMMENT(recipeId);

  const response = await axiosInstance.delete(END_POINT);
  return response.data;
};

export const postCommentLike = async (commentId: number) => {
  const response = await axiosInstance.post(END_POINTS.COMMENT_LIKE(commentId));
  return response.data;
};

export const postCommentWithRating = async ({
  recipeId,
  rating,
  comment,
}: {
  recipeId: number;
  rating: number;
  comment: string;
}) => {
  const response = await axiosInstance.post(END_POINTS.RATING(recipeId), {
    rating,
    comment,
  });
  return response.data;
};
