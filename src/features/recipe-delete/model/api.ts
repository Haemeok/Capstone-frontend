import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteRecipe = async (id: number) => {
  const response = await api.delete(END_POINTS.RECIPE(id));
  return response;
};
