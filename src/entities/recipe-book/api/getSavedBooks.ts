import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

import type { SavedBooksResponse, SavedBookSummary } from "./types";

type RawSavedBook = Omit<SavedBookSummary, "isDefault"> & { default: boolean };
type RawSavedBooksResponse = Omit<SavedBooksResponse, "books"> & {
  books: RawSavedBook[];
};

export const toSavedBook = ({
  default: isDefault,
  ...rest
}: RawSavedBook): SavedBookSummary => ({ ...rest, isDefault: !!isDefault });

export const getSavedBooks = async (
  recipeId: string
): Promise<SavedBooksResponse> => {
  const raw = await api.get<RawSavedBooksResponse>(
    END_POINTS.RECIPE_SAVED_BOOKS(recipeId)
  );
  return { ...raw, books: raw.books.map(toSavedBook) };
};
