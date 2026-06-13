import { format } from "@/shared/i18n";
import { recipeFormMessages } from "@/shared/i18n/recipeFormMessages";

import { buildRecipeFormSchema, RecipeFormValues } from "../config";
import { TITLE } from "../constants";

const baseValues: RecipeFormValues = {
  title: "테스트 레시피",
  image: "https://example.com/main.webp",
  ingredients: [
    { ingredientId: "i1", name: "당근", quantity: "1", unit: "개" },
  ],
  cookingTime: 10,
  servings: 2,
  dishType: "볶음",
  description: "테스트용 레시피 설명입니다",
  steps: [
    {
      instruction: "재료를 손질한다",
      stepNumber: 0,
      image: null,
      ingredients: [],
    },
  ],
  cookingTools: [],
  tags: [],
};

const shortTitleValues: RecipeFormValues = { ...baseValues, title: "a" };

const getTitleMessage = (
  validation: (typeof recipeFormMessages)["ko"]["validation"]
): string | undefined => {
  const result = buildRecipeFormSchema(validation).safeParse(shortTitleValues);
  if (result.success) return undefined;
  return result.error.issues.find((i) => i.path[0] === "title")?.message;
};

describe("buildRecipeFormSchema – locale-aware titleMin", () => {
  it("emits the ja titleMin message for a too-short title", () => {
    const jaValidation = recipeFormMessages.ja.validation;
    expect(getTitleMessage(jaValidation)).toBe(
      format(jaValidation.titleMin, { min: TITLE.MIN })
    );
  });

  it("emits the ko titleMin message for a too-short title (regression anchor)", () => {
    const koValidation = recipeFormMessages.ko.validation;
    expect(getTitleMessage(koValidation)).toBe(
      format(koValidation.titleMin, { min: TITLE.MIN })
    );
  });
});
