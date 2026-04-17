export const RECIPE_BOOK_QUERY_KEYS = {
  all: ["recipe-books"] as const,
  list: () => [...RECIPE_BOOK_QUERY_KEYS.all, "list"] as const,
  detail: (bookId: string, sort: string = "addedAt,desc") =>
    [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId, sort] as const,
  detailInfinite: (bookId: string, sort: string = "addedAt,desc") =>
    [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId, sort] as const,
  savedBooks: (recipeId: string) =>
    ["recipe-status", recipeId, "saved-books"] as const,
};
