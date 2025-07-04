import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const addIngredient = async (ingredientId: number) => {
  const response = await axiosInstance.post(END_POINTS.MY_INGREDIENTS, {
    ingredientId,
    useAuth: true,
  });
  return response.data;
};

export const addIngredientBulk = async (ingredientIds: number[]) => {
  const response = await axiosInstance.post(END_POINTS.MY_INGREDIENTS_BULK, {
    ingredientIds,
    useAuth: true,
  });
  return response.data;
};
