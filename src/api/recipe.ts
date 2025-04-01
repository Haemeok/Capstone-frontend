import { END_POINTS } from "@/constants/api";
import { axiosInstance } from "./axios";

const getRecipes = async () => {
  const response = await axiosInstance.get(END_POINTS.RECIPES);
  return response.data;
};

const getRecipe = async (id: number) => {
  const response = await axiosInstance.get(END_POINTS.RECIPE(id));
  return response.data;
};

export { getRecipes, getRecipe };
