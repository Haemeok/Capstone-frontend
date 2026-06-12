import {
  buildSearchQueryKey,
  buildSearchQueryParams,
} from "../useSearchResults";

describe("ja 검색 캐시 분리", () => {
  it("T-22: 같은 q라도 ko/ja queryKey가 다르다", () => {
    const base = ["recipes", null, null, "", "丼", "{}", "", "", ""] as const;
    const koKey = buildSearchQueryKey(base, "ko");
    const jaKey = buildSearchQueryKey(base, "ja");
    expect(koKey).not.toEqual(jaKey);
    expect(jaKey[jaKey.length - 1]).toBe("ja");
  });

  it("T-21: locale ja면 다음 페이지 파라미터에 lang=ja가 있다", () => {
    const params = buildSearchQueryParams(
      {
        sortCode: "popularityScore,DESC",
        dishTypeCode: null,
        tagCodes: [],
        q: "丼",
        nutritionQueryParams: {},
        types: [],
        ingredientIds: [],
        creatorCountryTags: [],
      },
      1,
      "ja"
    );
    expect(params.lang).toBe("ja");
    expect(params.pageParam).toBe(1);
  });
});
