import { END_POINTS } from '@/constants/api';
import { axiosInstance } from './axios';
import { IngredientItem, Recipe, RecipeGridItem } from '@/type/recipe';

export const getRecipes = async () => {
  const response = await axiosInstance.get(END_POINTS.RECIPES);
  return response.data;
};

export const getRecipe = async (id: number) => {
  const response = await axiosInstance.get(END_POINTS.RECIPE(id));
  return response.data;
};

export const getRecipeItems = async () => {
  const response = await axiosInstance.get<RecipeGridItem[]>(
    END_POINTS.RECIPES_SIMPLE,
  );
  return response.data;
};

export const postRecipe = async (recipe: Recipe) => {
  const response = await axiosInstance.post(END_POINTS.RECIPES, recipe, {
    useAuth: false,
  });
  console.log(response.data);
  return response.data;
};

export const editRecipe = async (id: number, recipe: Recipe) => {
  const response = await axiosInstance.put(END_POINTS.RECIPE(id), recipe);
  return response.data;
};

export const deleteRecipe = async (id: number) => {
  const response = await axiosInstance.delete(END_POINTS.RECIPE(id));
  return response.data;
};

export const postRecipeLike = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_LIKE(id));
  return response.data;
};

export const postRecipeFavorite = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_FAVORITE(id));
  return response.data;
};

export const postRecipeVisibility = async (id: number) => {
  const response = await axiosInstance.post(END_POINTS.RECIPE_VISIBILITY(id));
  return response.data;
};

export const getRecipesByCategory = async (categorySlug: string) => {
  const response = await axiosInstance.get(
    END_POINTS.RECIPES_BY_CATEGORY(categorySlug),
  );
  return response.data;
};
