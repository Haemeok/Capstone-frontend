import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postRecipeLike = async (id: number) => {
  const response = await api.post(END_POINTS.RECIPE_LIKE(id));
  return response;
};
