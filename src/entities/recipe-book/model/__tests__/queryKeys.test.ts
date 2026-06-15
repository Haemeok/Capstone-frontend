import { DEFAULT_BOOK_SORT, RECIPE_BOOK_QUERY_KEYS } from "../queryKeys";

describe("RECIPE_BOOK_QUERY_KEYS detail (T-07)", () => {
  it("detail/detailInfinite 키에 locale 세그먼트가 없다", () => {
    const detail = RECIPE_BOOK_QUERY_KEYS.detail("b1", DEFAULT_BOOK_SORT);
    const infinite = RECIPE_BOOK_QUERY_KEYS.detailInfinite(
      "b1",
      DEFAULT_BOOK_SORT
    );
    expect(detail).toEqual(["recipe-books", "detail", "b1", DEFAULT_BOOK_SORT]);
    expect(infinite).toEqual([
      "recipe-books",
      "infinite",
      "b1",
      DEFAULT_BOOK_SORT,
    ]);
    expect(detail).not.toContain("ja");
    expect(infinite).not.toContain("ja");
  });
});
