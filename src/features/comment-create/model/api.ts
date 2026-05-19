import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import { Comment } from "@/entities/comment";

import { PostCommentParams } from "./types";

export const postComment = async ({
  recipeId,
  commentId,
  comment,
  imageKeys,
}: PostCommentParams): Promise<Comment> => {
  const endpoint = commentId
    ? END_POINTS.RECIPE_REPLY(recipeId, commentId)
    : END_POINTS.RECIPE_COMMENT(recipeId);

  const body: { content: string; imageKeys?: string[] } = { content: comment };
  if (imageKeys && imageKeys.length > 0) body.imageKeys = imageKeys;

  return api.post<Comment>(endpoint, body);
};
