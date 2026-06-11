/**
 * @jest-environment node
 */
import { createRecipeStructuredData } from "../schema";
import {
  makeBaseRecipe,
  makeJpRecipe,
  makeOtherRecipe,
} from "./fixtures/recipeFactory";

describe("Recipe structured data — recipeCuisine", () => {
  it("JP 레시피의 recipeCuisine은 Japanese다", () => {
    const data = createRecipeStructuredData(makeJpRecipe(), "test-id");
    expect(data.recipeCuisine).toBe("Japanese");
  });

  it("KR/국가 없음 레시피의 recipeCuisine은 Korean이다", () => {
    const data = createRecipeStructuredData(makeBaseRecipe(), "test-id");
    expect(data.recipeCuisine).toBe("Korean");
  });

  it("OTHER 레시피의 구조화 데이터에는 recipeCuisine 키가 없다", () => {
    const data = createRecipeStructuredData(makeOtherRecipe(), "test-id");
    expect("recipeCuisine" in data).toBe(false);
  });
});
