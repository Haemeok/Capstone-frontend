import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const postCommentLike = async (commentId: number) => {
  const response = await axiosInstance.post(END_POINTS.COMMENT_LIKE(commentId));
  return response.data;
};
