import { syncStepIngredientUnit } from "../syncStepIngredientUnit";

import type { RecipeFormValues } from "../../model/config";

type Step = RecipeFormValues["steps"][number];

const baseStep = (
  ingredients: Step["ingredients"]
): Step => ({
  instruction: "",
  stepNumber: 0,
  image: null,
  ingredients,
});

describe("syncStepIngredientUnit", () => {
  it("updates unit of matching step ingredient by name", () => {
    const steps: Step[] = [
      baseStep([
        { ingredientId: "i1", name: "당근", quantity: "1", unit: "개" },
        { ingredientId: "i2", name: "양파", quantity: "1", unit: "개" },
      ]),
    ];

    const next = syncStepIngredientUnit(steps, "당근", "g");

    expect(next[0].ingredients[0].unit).toBe("g");
    expect(next[0].ingredients[1].unit).toBe("개");
  });

  it("updates across multiple steps", () => {
    const steps: Step[] = [
      baseStep([{ ingredientId: "i1", name: "당근", quantity: "1", unit: "개" }]),
      baseStep([{ ingredientId: "i1", name: "당근", quantity: "2", unit: "개" }]),
    ];

    const next = syncStepIngredientUnit(steps, "당근", "g");

    expect(next[0].ingredients[0].unit).toBe("g");
    expect(next[1].ingredients[0].unit).toBe("g");
  });

  it("returns same shape when no match", () => {
    const steps: Step[] = [
      baseStep([{ ingredientId: "i1", name: "당근", quantity: "1", unit: "개" }]),
    ];

    const next = syncStepIngredientUnit(steps, "감자", "g");

    expect(next[0].ingredients[0].unit).toBe("개");
  });
});
