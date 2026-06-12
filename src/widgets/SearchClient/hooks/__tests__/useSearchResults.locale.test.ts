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

describe("en 검색 캐시 분리", () => {
  it("T-23: 같은 q라도 ko/en queryKey가 다르다", () => {
    const base = [
      "recipes",
      null,
      null,
      "",
      "pasta",
      "{}",
      "",
      "",
      "",
    ] as const;
    const koKey = buildSearchQueryKey(base, "ko");
    const enKey = buildSearchQueryKey(base, "en");
    expect(koKey).not.toEqual(enKey);
    expect(enKey[enKey.length - 1]).toBe("en");
  });

  it("T-24: locale en이면 다음 페이지 파라미터에 lang=en이 있다", () => {
    const params = buildSearchQueryParams(
      {
        sortCode: "popularityScore,DESC",
        dishTypeCode: null,
        tagCodes: [],
        q: "pasta",
        nutritionQueryParams: {},
        types: [],
        ingredientIds: [],
        creatorCountryTags: [],
      },
      1,
      "en"
    );
    expect(params.lang).toBe("en");
    expect(params.pageParam).toBe(1);
  });

  it("T-25: locale ko면 lang 파라미터가 없다", () => {
    const params = buildSearchQueryParams(
      {
        sortCode: "popularityScore,DESC",
        dishTypeCode: null,
        tagCodes: [],
        q: "pasta",
        nutritionQueryParams: {},
        types: [],
        ingredientIds: [],
        creatorCountryTags: [],
      },
      0,
      "ko"
    );
    expect(params.lang).toBeUndefined();
  });
});
