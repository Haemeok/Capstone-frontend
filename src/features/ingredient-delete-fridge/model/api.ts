import { axiosInstance } from "@/shared/api/axios";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteIngredient = async (id: number) => {
  const response = await axiosInstance.delete(
    END_POINTS.MY_INGREDIENTS_BY_ID(id),
    {
      useAuth: true,
    }
  );
  return response.data;
};

export const deleteIngredientBulk = async (ingredientIds: number[]) => {
  const response = await axiosInstance.delete(END_POINTS.MY_INGREDIENTS_BULK, {
    data: {
      ingredientIds,
    },
    useAuth: true,
  });
  return response.data;
};
