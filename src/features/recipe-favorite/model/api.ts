import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const postRecipeFavorite = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_FAVORITE(id));
  return response.data;
};
