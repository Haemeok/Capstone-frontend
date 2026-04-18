import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeBook } from "./types";

type RawRecipeBook = {
  id: string;
  name: string;
  default: boolean;
  displayOrder: number;
  recipeCount: number;
};

const toRecipeBook = ({
  default: isDefault,
  ...rest
}: RawRecipeBook): RecipeBook => ({ ...rest, isDefault });

export const getRecipeBooks = async (): Promise<RecipeBook[]> => {
  const raw = await api.get<RawRecipeBook[]>(END_POINTS.RECIPE_BOOKS);
  return raw.map(toRecipeBook);
};
