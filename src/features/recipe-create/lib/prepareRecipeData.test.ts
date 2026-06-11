import { RecipeFormValues } from "../model/config";
import { prepareRecipeData } from "./prepareRecipeData";

const baseForm: RecipeFormValues = {
  title: "테스트 레시피",
  image: null,
  ingredients: [
    { ingredientId: "", name: "수제 육수", quantity: "200", unit: "ml" },
  ],
  cookingTime: 10,
  servings: 1,
  dishType: "국",
  description: "설명입니다",
  steps: [
    { instruction: "끓인다", stepNumber: 0, image: null, ingredients: [] },
  ],
  cookingTools: [],
  tags: [],
};

describe("prepareRecipeData - 커스텀 재료", () => {
  it("빈 id의 커스텀 재료를 id:''로 직렬화하고 name 필터에서 살아남는다", async () => {
    const { recipeData } = await prepareRecipeData(baseForm);
    expect(recipeData.ingredients).toEqual([
      { id: "", name: "수제 육수", quantity: "200", unit: "ml" },
    ]);
  });
});
