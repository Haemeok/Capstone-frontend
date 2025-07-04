import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteComment = async ({
  recipeId,
  commentId,
}: {
  recipeId: number;
  commentId: number;
}) => {
  const END_POINT = END_POINTS.RECIPE_COMMENT_BY_ID(recipeId, commentId);
  const response = await axiosInstance.delete(END_POINT);
  return response.data;
};
