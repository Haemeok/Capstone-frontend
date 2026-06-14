import { localizeIngredientName } from "../ingredientNameOverlay";

describe("localizeIngredientName", () => {
  it("등록 id는 현지명, 미등록은 koName fallback (T-15)", () => {
    const ja = localizeIngredientName("OAeLoBLq", "김치", "ja");
    expect(/[가-힣]/.test(ja)).toBe(false);
    expect(localizeIngredientName("___none___", "김치", "ja")).toBe("김치");
    expect(localizeIngredientName("OAeLoBLq", "김치", "ko")).toBe("김치");
  });
});
