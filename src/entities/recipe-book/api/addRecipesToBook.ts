import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type {
  AddRecipesToBookRequest,
  AddRecipesToBookResponse,
} from "./types";

export const addRecipesToBook = async (
  bookId: string,
  body: AddRecipesToBookRequest
): Promise<AddRecipesToBookResponse> => {
  return api.post<AddRecipesToBookResponse>(
    END_POINTS.RECIPE_BOOK_RECIPES(bookId),
    body
  );
};
