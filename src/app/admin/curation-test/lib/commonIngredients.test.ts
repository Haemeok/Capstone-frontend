import { findCommonIngredientNames } from "./commonIngredients";

describe("findCommonIngredientNames", () => {
  it("모든 레시피에 등장하는 재료 이름만 반환", () => {
    const recipes = [
      {
        ingredients: [
          { id: "a", name: "쪽파" },
          { id: "b", name: "마늘" },
          { id: "c", name: "간장" },
        ],
      },
      {
        ingredients: [
          { id: "a", name: "쪽파" },
          { id: "b", name: "마늘" },
          { id: "d", name: "참기름" },
        ],
      },
      {
        ingredients: [
          { id: "a", name: "쪽파" },
          { id: "e", name: "토마토" },
        ],
      },
    ];

    expect(findCommonIngredientNames(recipes)).toEqual(["쪽파"]);
  });

  it("교차 결과가 비면 빈 배열", () => {
    const recipes = [
      { ingredients: [{ id: "a", name: "쪽파" }] },
      { ingredients: [{ id: "b", name: "마늘" }] },
    ];
    expect(findCommonIngredientNames(recipes)).toEqual([]);
  });

  it("recipes가 비면 빈 배열", () => {
    expect(findCommonIngredientNames([])).toEqual([]);
  });

  it("id가 없으면 name으로 fallback 매칭", () => {
    const recipes = [
      { ingredients: [{ name: "쪽파" }, { name: "마늘" }] },
      { ingredients: [{ name: "쪽파" }, { name: "참기름" }] },
    ];
    expect(findCommonIngredientNames(recipes)).toEqual(["쪽파"]);
  });

  it("같은 레시피 안에서 id 중복은 1번만 카운트", () => {
    const recipes = [
      {
        ingredients: [
          { id: "a", name: "쪽파" },
          { id: "a", name: "쪽파" },
        ],
      },
      { ingredients: [{ id: "a", name: "쪽파" }] },
    ];
    expect(findCommonIngredientNames(recipes)).toEqual(["쪽파"]);
  });
});
