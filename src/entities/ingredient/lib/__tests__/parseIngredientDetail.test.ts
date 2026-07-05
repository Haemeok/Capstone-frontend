import type { IngredientDetailApiResponse } from "../../model/types";
import { parseIngredientDetail } from "../parseIngredientDetail";

const baseApi: IngredientDetailApiResponse = {
  id: "test-id",
  name: "테스트재료",
  category: null,
  imageUrl: null,
  storageLocation: null,
  storageTemperature: null,
  storageDuration: null,
  storageNotes: null,
  goodPairItems: null,
  badPairItems: null,
  recommendedCookingMethods: null,
  recipes: [],
};

describe("parseIngredientDetail", () => {
  it("normalizes missing optional fields to safe defaults", () => {
    const view = parseIngredientDetail(baseApi);

    expect(view.coupangLink).toBeNull();
    expect(view.nutrition).toBeNull();
    expect(view.seasonMonths).toEqual([]);
    expect(view.benefits).toBeNull();
    expect(view.pairings.good).toEqual([]);
    expect(view.pairings.bad).toEqual([]);
    expect(view.cookingMethods).toEqual([]);
  });

  it("passes through populated optional fields", () => {
    const view = parseIngredientDetail({
      ...baseApi,
      coupangLink: "https://coupa.ng/test",
      nutritionPer100g: {
        kcal: 25,
        proteinG: 1.2,
        carbohydrateG: 5.8,
        fatG: 0.1,
        sugarG: 2.3,
        sodiumMg: 10,
      },
      seasonMonths: [3, 4, 5],
      benefits: "비타민 C가 풍부하고 면역력 강화에 도움이 된다.",
    });

    expect(view.coupangLink).toBe("https://coupa.ng/test");
    expect(view.nutrition).toEqual({
      kcal: 25,
      proteinG: 1.2,
      carbohydrateG: 5.8,
      fatG: 0.1,
      sugarG: 2.3,
      sodiumMg: 10,
    });
    expect(view.seasonMonths).toEqual([3, 4, 5]);
    expect(view.benefits).toBe(
      "비타민 C가 풍부하고 면역력 강화에 도움이 된다."
    );
  });

  it("passes through pair items as objects with id/name/imageUrl", () => {
    const goodPairItems = [
      { id: "abc", name: "삼겹살", imageUrl: "https://cdn/x.jpg" },
      { id: "def", name: "마늘", imageUrl: null },
    ];

    const view = parseIngredientDetail({ ...baseApi, goodPairItems });

    expect(view.pairings.good).toEqual(goodPairItems);
  });

  it("parses recommendedCookingMethods slash list with trim and empty filtering", () => {
    expect(
      parseIngredientDetail({
        ...baseApi,
        recommendedCookingMethods: "쌈 / 샐러드 / 겉절이",
      }).cookingMethods
    ).toEqual(["쌈", "샐러드", "겉절이"]);

    expect(
      parseIngredientDetail({
        ...baseApi,
        recommendedCookingMethods: "  /  /  ",
      }).cookingMethods
    ).toEqual([]);
  });

  it("returns null nutrition when all macros are zero/falsy", () => {
    const view = parseIngredientDetail({
      ...baseApi,
      nutritionPer100g: {
        kcal: 0,
        proteinG: 0,
        carbohydrateG: 0,
        fatG: 0,
      },
    });
    expect(view.nutrition).toBeNull();
  });

  it("coupang 필드를 매핑한다", () => {
    const view = parseIngredientDetail({
      ...baseApi,
      coupang: {
        landingUrl: "https://land",
        lastCollectedAt: "2026-07-04T12:30:00+09:00",
        products: [],
      },
    });
    expect(view.coupang?.landingUrl).toBe("https://land");
  });
});
