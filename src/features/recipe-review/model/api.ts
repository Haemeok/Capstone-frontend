import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postCommentWithRating = async ({
  recipeId,
  rating,
  comment,
}: {
  recipeId: string;
  rating: number;
  comment: string;
}) => {
  const response = await api.post(END_POINTS.RATING(recipeId), {
    rating,
    comment,
  });
  return response;
};
