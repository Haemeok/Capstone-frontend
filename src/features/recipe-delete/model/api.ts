import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteRecipe = async (id: number) => {
  const response = await axiosInstance.delete(END_POINTS.RECIPE(id));
  return response.data;
};
