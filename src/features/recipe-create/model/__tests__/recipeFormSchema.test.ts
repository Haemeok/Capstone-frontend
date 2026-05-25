import { recipeFormSchema, RecipeFormValues } from "../config";
import { MSG } from "../messages";

const baseIngredient = {
  ingredientId: "i1",
  name: "당근",
  quantity: "1",
  unit: "개",
};

const baseStep: RecipeFormValues["steps"][number] = {
  instruction: "재료를 손질한다",
  stepNumber: 0,
  image: null,
  ingredients: [],
};

const baseValues: RecipeFormValues = {
  title: "테스트 레시피",
  image: "https://example.com/main.webp",
  ingredients: [baseIngredient],
  cookingTime: 10,
  servings: 2,
  dishType: "볶음",
  description: "테스트용 레시피 설명입니다",
  steps: [baseStep],
  cookingTools: [],
  tags: [],
};

const getIngredientIssues = (
  ingredient: (typeof baseIngredient) | Record<string, unknown>
) => {
  const result = recipeFormSchema.safeParse({
    ...baseValues,
    ingredients: [ingredient],
  });
  if (result.success) return [];
  return result.error.issues.filter((i) => i.path[0] === "ingredients");
};

describe("recipeFormSchema – ingredient row", () => {
  it("accepts empty ingredientId (non-master ingredient)", () => {
    expect(
      getIngredientIssues({ ...baseIngredient, ingredientId: "" })
    ).toEqual([]);
  });

  it("accepts empty name (defensive against null coerce)", () => {
    expect(getIngredientIssues({ ...baseIngredient, name: "" })).toEqual([]);
  });

  it("rejects null ingredientId — mapping layer must coerce to string", () => {
    const issues = getIngredientIssues({
      ...baseIngredient,
      ingredientId: null,
    });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejects null name — mapping layer must coerce to string", () => {
    const issues = getIngredientIssues({ ...baseIngredient, name: null });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("requires quantity", () => {
    const issues = getIngredientIssues({ ...baseIngredient, quantity: "" });
    expect(issues.some((i) => i.message === MSG.DESCRIPTION.QUANTITY)).toBe(
      true
    );
  });
});

describe("recipeFormSchema – '약간' quantity exempts unit", () => {
  it("accepts empty unit when quantity is '약간'", () => {
    expect(
      getIngredientIssues({
        ...baseIngredient,
        quantity: "약간",
        unit: "",
      })
    ).toEqual([]);
  });

  it("accepts non-empty unit when quantity is '약간'", () => {
    expect(
      getIngredientIssues({
        ...baseIngredient,
        quantity: "약간",
        unit: "g",
      })
    ).toEqual([]);
  });

  it("rejects empty unit when quantity is a number", () => {
    const issues = getIngredientIssues({
      ...baseIngredient,
      quantity: "1",
      unit: "",
    });
    expect(issues.some((i) => i.message === MSG.DESCRIPTION.UNIT)).toBe(true);
  });
});

describe("recipeFormSchema – ingredients array", () => {
  it("rejects empty ingredients array", () => {
    const result = recipeFormSchema.safeParse({
      ...baseValues,
      ingredients: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === MSG.INGREDIENTS.MIN)
      ).toBe(true);
    }
  });

  it("accepts happy path", () => {
    const result = recipeFormSchema.safeParse(baseValues);
    if (!result.success) {
      // surface the cause so failures aren't a mystery
      throw new Error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });
});
