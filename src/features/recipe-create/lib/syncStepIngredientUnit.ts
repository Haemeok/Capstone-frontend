import type { RecipeFormValues } from "../model/config";

type Step = RecipeFormValues["steps"][number];

export const syncStepIngredientUnit = (
  steps: Step[],
  ingredientName: string,
  nextUnit: string
): Step[] =>
  steps.map((step) => ({
    ...step,
    ingredients: step.ingredients.map((ing) =>
      ing.name === ingredientName ? { ...ing, unit: nextUnit } : ing
    ),
  }));
