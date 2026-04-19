// TODO: switch back to "addedAt,desc" once backend supports it as a sort key.
// addedAt is a join-table column not exposed via JPA Pageable, so it currently 500s.
export const DEFAULT_BOOK_SORT = "createdAt,desc";

export const BOOK_DETAIL_PAGE_SIZE = 5;

export const MAX_RECIPE_BOOKS = 5;

export const RECIPE_BOOK_QUERY_KEYS = {
  all: ["recipe-books"] as const,
  list: () => [...RECIPE_BOOK_QUERY_KEYS.all, "list"] as const,
  detailPrefix: (bookId: string) =>
    [...RECIPE_BOOK_QUERY_KEYS.all, "detail", bookId] as const,
  detail: (bookId: string, sort: string = DEFAULT_BOOK_SORT) =>
    [...RECIPE_BOOK_QUERY_KEYS.detailPrefix(bookId), sort] as const,
  infinitePrefix: (bookId: string) =>
    [...RECIPE_BOOK_QUERY_KEYS.all, "infinite", bookId] as const,
  detailInfinite: (bookId: string, sort: string = DEFAULT_BOOK_SORT) =>
    [...RECIPE_BOOK_QUERY_KEYS.infinitePrefix(bookId), sort] as const,
  savedBooks: (recipeId: string) =>
    ["recipe-status", recipeId, "saved-books"] as const,
};
