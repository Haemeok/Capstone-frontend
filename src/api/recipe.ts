import { END_POINTS } from "@/constants/api";
import { axiosInstance } from "./axios";
import { Recipe, RecipeGridItem } from "@/type/recipe";

const getRecipes = async () => {
  const response = await axiosInstance.get(END_POINTS.RECIPES);
  return response.data;
};

const getRecipe = async (id: number) => {
  const response = await axiosInstance.get(END_POINTS.RECIPE(id));
  return response.data;
};

export const getRecipeItems = async () => {
  const response = await axiosInstance.get<RecipeGridItem[]>(
    END_POINTS.RECIPES_SIMPLE
  );
  return response.data;
};

const postRecipe = async (recipe: Recipe) => {
  const response = await axiosInstance.post(END_POINTS.RECIPES, recipe, {
    useAuth: false,
  });
  console.log(response.data);
  return response.data;
};

const editRecipe = async (id: number, recipe: Recipe) => {
  const response = await axiosInstance.put(END_POINTS.RECIPE(id), recipe);
  return response.data;
};

const deleteRecipe = async (id: number) => {
  const response = await axiosInstance.delete(END_POINTS.RECIPE(id));
  return response.data;
};

const postRecipeLike = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_LIKE(id));
  return response.data;
};

const postRecipeFavorite = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_FAVORITE(id));
  return response.data;
};

const postRecipeVisibility = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_VISIBILITY(id));
  return response.data;
};

export {
  getRecipes,
  getRecipe,
  postRecipe,
  editRecipe,
  deleteRecipe,
  postRecipeLike,
  postRecipeFavorite,
  postRecipeVisibility,
};
