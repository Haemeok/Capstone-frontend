import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { RemoveRecipesFromBookRequest } from "./types";

export const removeRecipesFromBook = async (
  bookId: string,
  body: RemoveRecipesFromBookRequest
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(
    END_POINTS.RECIPE_BOOK_RECIPES(bookId),
    {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
};
