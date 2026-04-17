import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteRecipeBook = async (
  bookId: string
): Promise<{ message: string }> => {
  return api.delete<{ message: string }>(END_POINTS.RECIPE_BOOK(bookId));
};
