import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";
import type { Locale } from "@/shared/i18n";

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

export const getRecipeBooks = async (lang: Locale): Promise<RecipeBook[]> => {
  const raw = await api.get<RawRecipeBook[]>(END_POINTS.RECIPE_BOOKS, {
    params: { lang },
  });
  return raw.map(toRecipeBook);
};
