import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";
import { FinalizeRecipeResponse } from "./types";

export const finalizeRecipe = async (recipeId: number) => {
  const response = await axiosInstance.post<FinalizeRecipeResponse>(
    END_POINTS.RECIPE_FINALIZE(recipeId)
  );
  return response.data;
};
