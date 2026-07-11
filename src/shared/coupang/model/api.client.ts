import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RecipeCoupangProductsResponse } from "./types";

export const getRecipeCoupangProducts = (
  recipeId: string
): Promise<RecipeCoupangProductsResponse> =>
  api.get<RecipeCoupangProductsResponse>(
    END_POINTS.RECIPE_COUPANG_PRODUCTS(recipeId)
  );
