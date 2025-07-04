import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

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
