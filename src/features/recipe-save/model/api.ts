import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const postRecipeFavorite = async (id: string) => {
  const response = await api.post(END_POINTS.RECIPE_FAVORITE(id));
  return response;
};
