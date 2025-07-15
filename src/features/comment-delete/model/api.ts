import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteComment = async ({
  recipeId,
  commentId,
}: {
  recipeId: number;
  commentId: number;
}) => {
  const END_POINT = END_POINTS.RECIPE_COMMENT_BY_ID(recipeId, commentId);
  const response = await api.delete(END_POINT);
  return response;
};
