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
  goodPairs: null,
  badPairs: null,
  recommendedCookingMethods: null,
  recipes: [],
};

describe("parseIngredientDetail — new fields", () => {
  it("normalizes missing optional fields to safe defaults", () => {
    const view = parseIngredientDetail(baseApi);

    expect(view.shortDescription).toBeNull();
    expect(view.coupangLink).toBeNull();
    expect(view.nutrition).toBeNull();
    expect(view.seasonMonths).toEqual([]);
    expect(view.benefits).toEqual([]);
    expect(view.prepTip).toBeNull();
    expect(view.substitutes).toEqual([]);
  });

  it("passes through populated optional fields", () => {
    const view = parseIngredientDetail({
      ...baseApi,
      shortDescription: "요리의 베이스가 되는 향채",
      coupangLink: "https://coupa.ng/test",
      nutritionPer100g: {
        calories: 25,
        protein: 1.2,
        carb: 5.8,
        fat: 0.1,
      },
      seasonMonths: [3, 4, 5],
      benefits: ["비타민 C 풍부", "면역력 강화"],
      prepTip: "뿌리를 잘라내고 흐르는 물에 씻으세요.",
    });

    expect(view.shortDescription).toBe("요리의 베이스가 되는 향채");
    expect(view.coupangLink).toBe("https://coupa.ng/test");
    expect(view.nutrition).toEqual({
      calories: 25,
      protein: 1.2,
      carb: 5.8,
      fat: 0.1,
    });
    expect(view.seasonMonths).toEqual([3, 4, 5]);
    expect(view.benefits).toEqual(["비타민 C 풍부", "면역력 강화"]);
    expect(view.prepTip).toBe("뿌리를 잘라내고 흐르는 물에 씻으세요.");
  });

  it("parses substitutes slash list with trim and empty filtering", () => {
    expect(
      parseIngredientDetail({ ...baseApi, substitutes: "샬롯 / 쪽파 / 양파" })
        .substitutes
    ).toEqual(["샬롯", "쪽파", "양파"]);

    expect(
      parseIngredientDetail({ ...baseApi, substitutes: "샬롯/쪽파" })
        .substitutes
    ).toEqual(["샬롯", "쪽파"]);

    expect(
      parseIngredientDetail({ ...baseApi, substitutes: "  /  /  " })
        .substitutes
    ).toEqual([]);
  });
});
