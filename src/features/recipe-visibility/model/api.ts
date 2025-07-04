import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const postRecipeVisibility = async (recipeId: number) => {
  const response = await axiosInstance.post(
    END_POINTS.RECIPE_VISIBILITY(recipeId)
  );
  return response.data;
};
