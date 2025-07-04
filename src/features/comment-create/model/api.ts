import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

import { Comment } from "@/entities/comment";

import { PostCommentParams } from "./types";

export const postComment = async ({
  recipeId,
  commentId,
  comment,
}: PostCommentParams): Promise<Comment> => {
  const END_POINT = commentId
    ? END_POINTS.RECIPE_REPLY(recipeId, commentId)
    : END_POINTS.RECIPE_COMMENT(recipeId);

  const response = await axiosInstance.post<Comment>(END_POINT, {
    content: comment,
  });
  return response.data;
};
