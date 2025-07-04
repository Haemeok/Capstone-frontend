import { IngredientPayload } from "@/entities/ingredient";

export type RecipeFormValues = {
  title: string;
  dishType: string;
  description: string;
  cookingTime: string | number;
  servings: string | number;
  youtubeUrl?: string;
  cookingTools?: string[];
  tagNames: string[];
  imageFile: FileList | null;
  imageKey?: string | null;
  ingredients: IngredientPayload[];
  steps: Array<{
    stepNumber: number;
    instruction: string;
    imageFile?: FileList | null;
    imageKey?: string | null;
    ingredients: IngredientPayload[];
  }>;
};

export type FinalizeRecipeResponse = {
  recipeId: number;
  activeImages: string[];
  missingImages: string[];
};
