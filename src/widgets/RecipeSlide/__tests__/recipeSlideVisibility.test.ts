import { shouldHideRecipeSlide } from "../recipeSlideVisibility";

describe("shouldHideRecipeSlide", () => {
  it("로딩 중엔 숨기지 않는다(스켈레톤 노출)", () => {
    expect(
      shouldHideRecipeSlide({
        isLoading: true,
        hasError: false,
        recipeCount: 0,
      })
    ).toBe(false);
  });
  it("content가 비면 숨긴다 (T-B2)", () => {
    expect(
      shouldHideRecipeSlide({
        isLoading: false,
        hasError: false,
        recipeCount: 0,
      })
    ).toBe(true);
  });
  it("에러면 숨긴다 (T-C5/T-D5/T-E4)", () => {
    expect(
      shouldHideRecipeSlide({
        isLoading: false,
        hasError: true,
        recipeCount: 5,
      })
    ).toBe(true);
  });
  it("meta 필수인데 이름이 null이면 숨긴다 (T-C3/T-E3/T-F3)", () => {
    expect(
      shouldHideRecipeSlide({
        isLoading: false,
        hasError: false,
        recipeCount: 5,
        requiresMeta: true,
        metaName: null,
      })
    ).toBe(true);
  });
  it("meta 필수 + 이름 있고 content 있으면 보인다 (T-C1/T-E1/T-F2)", () => {
    expect(
      shouldHideRecipeSlide({
        isLoading: false,
        hasError: false,
        recipeCount: 5,
        requiresMeta: true,
        metaName: "양파",
      })
    ).toBe(false);
  });
});
