import { buildCustomIngredient } from "./buildCustomIngredient";

describe("buildCustomIngredient", () => {
  it("유효한 이름이면 빈 id의 커스텀 재료를 만든다", () => {
    const result = buildCustomIngredient("수제 육수", new Set(["양파"]));
    expect(result).toEqual({
      id: "",
      name: "수제 육수",
      quantity: "",
      unit: "",
    });
  });

  it("이미 목록에 있는 이름이면 만들지 않는다", () => {
    expect(buildCustomIngredient("양파", new Set(["양파"]))).toBeNull();
  });

  it("빈/공백 이름이면 만들지 않는다", () => {
    expect(buildCustomIngredient("", new Set())).toBeNull();
    expect(buildCustomIngredient("   ", new Set())).toBeNull();
  });
});
