import { useRecipeBookDetail } from "./useRecipeBookDetail";

/**
 * Returns the displayed recipe count for a recipe book.
 *
 * TEMPORARY workaround: backend's `recipeCount` field on the recipe book
 * list API is not initialized (always 0). We reuse the detail fetch's
 * `recipes` array length instead. Bounded by page size (20) — large books
 * will undercount until the backend fix ships.
 *
 * Remove this hook (revert callers to `book.recipeCount`) once the backend
 * properly initializes the list API count.
 */
export const useDisplayedRecipeCount = (
  bookId: string,
  fallback: number
): number => {
  const { data } = useRecipeBookDetail(bookId);
  return data?.recipes?.length ?? fallback;
};
