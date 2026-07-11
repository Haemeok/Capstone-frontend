import { buildAddPayload } from "../buildAddPayload";

describe("buildAddPayload", () => {
  it("T-02: 기본 인분(servingRatio 1)이어도 원본 quantity/unit을 보낸다", () => {
    const payload = buildAddPayload({
      recipeIngredientId: "ri8AbKcQ",
      quantity: "100",
      unit: "g",
      servingRatio: 1,
    });
    expect(payload).toEqual({
      recipeIngredientId: "ri8AbKcQ",
      quantity: "100",
      unit: "g",
    });
  });

  it("T-03: 인분수 2배면 환산된 quantity/unit을 포함한다 (대파 1/2대 → 1대)", () => {
    const payload = buildAddPayload({
      recipeIngredientId: "ri5UvGhD",
      quantity: "1/2",
      unit: "대",
      servingRatio: 2,
    });
    expect(payload).toEqual({
      recipeIngredientId: "ri5UvGhD",
      quantity: "1",
      unit: "대",
    });
  });

  it("quantity가 없으면 인분수를 바꿔도 필드를 생략한다", () => {
    const payload = buildAddPayload({
      recipeIngredientId: "ri7NoQty",
      quantity: undefined,
      unit: "g",
      servingRatio: 2,
    });
    expect(payload).toEqual({ recipeIngredientId: "ri7NoQty" });
  });
});
