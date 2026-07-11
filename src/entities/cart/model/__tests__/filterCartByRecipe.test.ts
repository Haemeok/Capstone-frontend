import { filterCartByRecipe } from "../filterCartByRecipe";
import { cartFixture } from "./fixtures";

describe("filterCartByRecipe", () => {
  it("T-07: 레시피 선택 시 해당 항목만 남기고 빈 그룹은 제거한다", () => {
    const filtered = filterCartByRecipe(cartFixture, "r7KpQ2mA");
    const kimchiGroup = filtered.groups.find(
      (g) => g.coupangInfo.coupangName === "김치"
    );
    expect(kimchiGroup?.items.map((i) => i.cartItemId)).toEqual(["c8Ab7XyZ"]);
    expect(filtered.unmatchedItems).toEqual([]);
    expect(filtered.groups).toHaveLength(3);
  });

  it("T-07: null이면 원본 그대로 반환한다", () => {
    expect(filterCartByRecipe(cartFixture, null)).toEqual(cartFixture);
  });

  it("T-07: 항목이 전혀 없는 레시피를 고르면 그룹이 전부 제거된다", () => {
    const filtered = filterCartByRecipe(cartFixture, "nonexistent");
    expect(filtered.groups).toEqual([]);
    expect(filtered.unmatchedItems).toEqual([]);
  });
});
