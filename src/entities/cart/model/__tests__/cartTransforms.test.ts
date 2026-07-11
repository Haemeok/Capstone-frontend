import { removeItemsFromCart, updateItemInCart } from "../cartTransforms";
import { cartFixture } from "./fixtures";

describe("removeItemsFromCart", () => {
  it("항목이 빠진 그룹은 제거되고 totalItemCount·recipes.itemCount가 재계산된다", () => {
    const next = removeItemsFromCart(cartFixture, ["c6Rt4MnB", "c4Qs9NwE"]);

    expect(next.totalItemCount).toBe(3);
    expect(
      next.groups.find((g) => g.coupangInfo.coupangName === "돼지고기 앞다리살")
    ).toBeUndefined();
    expect(next.unmatchedItems).toHaveLength(0);
    expect(next.recipes.find((r) => r.recipeId === "n3Vz8WpR")).toBeUndefined();
    expect(next.recipes.find((r) => r.recipeId === "r7KpQ2mA")?.itemCount).toBe(
      2
    );
  });
});

describe("updateItemInCart", () => {
  it("빈 문자열 unit이면 기존 unit을 유지한다", () => {
    const next = updateItemInCart(cartFixture, "c8Ab7XyZ", {
      quantity: "300",
      unit: "",
    });

    const item = next.groups
      .flatMap((g) => g.items)
      .find((i) => i.cartItemId === "c8Ab7XyZ");
    expect(item).toMatchObject({ quantity: "300", unit: "g" });
  });
});
