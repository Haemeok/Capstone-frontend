import type { Recipe } from "@/entities/recipe/model/types";

import type { BlogPostJsonLd, BlogPostNutritionBox } from "./blogPost.schema";

const formatIngredient = (
  i: Recipe["ingredients"][number]
): string => {
  const qtyUnit = `${i.quantity ?? ""}${i.unit ?? ""}`.trim();
  return qtyUnit ? `${i.name} ${qtyUnit}` : i.name;
};

export const buildJsonLd = (
  recipe: Recipe,
  nutritionBox: BlogPostNutritionBox
): BlogPostJsonLd => {
  const totalTime =
    recipe.cookingTime && recipe.cookingTime > 0
      ? `PT${recipe.cookingTime}M`
      : undefined;

  const sortedSteps = (recipe.steps ?? [])
    .slice()
    .sort((a, b) => a.stepNumber - b.stepNumber);

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    recipeYield: `${recipe.servings ?? 1}인분`,
    ...(totalTime ? { totalTime } : {}),
    recipeIngredient: (recipe.ingredients ?? []).map(formatIngredient),
    recipeInstructions: sortedSteps.map((s) => ({
      "@type": "HowToStep",
      text: s.instruction ?? "",
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${nutritionBox.kcalPerServing} kcal`,
      proteinContent: `${nutritionBox.proteinG} g`,
      carbohydrateContent: `${nutritionBox.carbohydrateG} g`,
      fatContent: `${nutritionBox.fatG} g`,
      sugarContent: `${nutritionBox.sugarG} g`,
      sodiumContent: `${nutritionBox.sodiumMg} mg`,
    },
  };
};
