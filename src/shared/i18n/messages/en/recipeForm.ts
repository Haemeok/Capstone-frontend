import type { RecipeFormDict } from "../../types";

export const recipeForm: RecipeFormDict = {
  labels: {
    title: "Recipe title",
    image: "Cover image",
    ingredients: "Ingredients",
    cookingTime: "Cooking time",
    servings: "Servings",
    dishType: "Category",
    description: "Recipe description",
    steps: "Steps",
    cookingTools: "Cooking tools",
    tags: "Tags",
  },
  validation: {
    titleMin: "Title must be at least {min} characters.",
    titleMax: "Title can be up to {max} characters.",
    imageRequired: "Please add a cover image for your recipe.",
    imageType: "You can upload PNG, JPG, WEBP, GIF, and AVIF files only.",
    imageSize: "Please upload an image of {max}MB or less.",
    servingsMin: "Servings must be at least {min}.",
    cookingTimeMin: "Cooking time must be at least {min}.",
    descriptionMin: "Description must be at least {min} characters.",
    quantityRequired: "Please enter a quantity.",
    unitRequired: "Please select a unit.",
    ingredientsMin: "Please add at least {min} ingredient.",
    stepsMin: "Please add at least {min} step.",
    instructionRequired: "Please enter the instructions.",
    categoryRequired: "Please select a category.",
  },
};
