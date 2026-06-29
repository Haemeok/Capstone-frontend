import type { CategoryDict } from "../../types";

export const category: CategoryDict = {
  navAriaLabel: "Categories",
  emptyTitle: "No {tagName} recipes yet",
  emptySubtitle: "Be the first to create one.",
  emptyCta: "Create a recipe",
  meta: {
    fallbackTitle: "Category - Recipio",
    titleTemplate: "{emoji} {name} recipes",
    descriptionTemplate:
      "Browse popular {name} recipes. Cook delicious {name} dishes at home with AI-recommended ideas.",
    keywordRecipe: "{name} recipe",
    keywordRecipeMethod: "{name} cooking",
    keywordByCategory: "recipes by category",
    imageAltTemplate: "{name} recipes",
  },
};
