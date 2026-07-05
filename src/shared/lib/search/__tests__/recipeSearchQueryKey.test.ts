import {
  buildRecipeSearchBaseKey,
  buildSearchQueryKey,
} from "../recipeSearchQueryKey";

const emptyInput = {
  dishTypeCode: null,
  sortCode: null,
  tagCodes: [],
  q: "",
  nutritionQueryParams: {},
  types: [],
  ingredientIds: [],
  creatorCountryTags: [],
};

describe("buildRecipeSearchBaseKey", () => {
  it("항상 9칸이고 'recipes'로 시작, country가 마지막 칸", () => {
    const key = buildRecipeSearchBaseKey({
      ...emptyInput,
      creatorCountryTags: ["KR", "JP"],
    });
    expect(key).toHaveLength(9);
    expect(key[0]).toBe("recipes");
    expect(key[8]).toBe("KR,JP");
  });

  it("배열/객체 슬롯을 내부에서 직렬화한다", () => {
    const key = buildRecipeSearchBaseKey({
      dishTypeCode: "FRYING",
      sortCode: "popularityScore,DESC",
      tagCodes: ["a", "b"],
      q: "감자",
      nutritionQueryParams: { minCalories: 100 },
      types: ["USER", "AI"],
      ingredientIds: ["x", "y"],
      creatorCountryTags: ["KR"],
    });
    expect(key).toEqual([
      "recipes",
      "FRYING",
      "popularityScore,DESC",
      "a,b",
      "감자",
      JSON.stringify({ minCalories: 100 }),
      "USER,AI",
      "x,y",
      "KR",
    ]);
  });

  it("빈 입력은 country 칸까지 포함해 9칸을 유지한다", () => {
    expect(buildRecipeSearchBaseKey(emptyInput)).toEqual([
      "recipes",
      null,
      null,
      "",
      "",
      "{}",
      "",
      "",
      "",
    ]);
  });
});

describe("buildSearchQueryKey (locale)", () => {
  it("ko는 base를 그대로 반환(9칸)", () => {
    const base = buildRecipeSearchBaseKey(emptyInput);
    expect(buildSearchQueryKey(base, "ko")).toEqual(base);
    expect(buildSearchQueryKey(base, "ko")).toHaveLength(9);
  });

  it("ja/en은 locale을 마지막에 덧붙인다(10칸)", () => {
    const base = buildRecipeSearchBaseKey(emptyInput);
    const jaKey = buildSearchQueryKey(base, "ja");
    const enKey = buildSearchQueryKey(base, "en");
    expect(jaKey).toHaveLength(10);
    expect(jaKey[jaKey.length - 1]).toBe("ja");
    expect(enKey[enKey.length - 1]).toBe("en");
    expect(jaKey).not.toEqual(enKey);
  });
});
