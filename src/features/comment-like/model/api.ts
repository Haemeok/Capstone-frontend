import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postCommentLike = async (commentId: number) => {
  const response = await api.post(END_POINTS.COMMENT_LIKE(commentId));
  return response;
};
