import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postCommentLike = async (commentId: string): Promise<void> => {
  await api.post<void>(END_POINTS.COMMENT_LIKE(commentId));
};
