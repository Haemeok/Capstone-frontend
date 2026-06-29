import type { IngredientPayload } from "@/entities/ingredient";
import type {
  Recipe,
  RecipePayload,
  RecipeStepPayload,
} from "@/entities/recipe/model/types";

export const prepareRemixPayload = (
  recipe: Recipe,
  originRecipeId: string
): RecipePayload => {
  const {
    // response-only fields omitted by RecipePayload type — excluded for clarity
    id: _id,
    imageUrl: _imageUrl,
    author: _author,
    likeCount: _likeCount,
    likedByCurrentUser: _likedByCurrentUser,
    favoriteByCurrentUser: _favoriteByCurrentUser,
    ratingInfo: _ratingInfo,
    comments: _comments,
    totalCalories: _totalCalories,
    totalIngredientCost: _totalIngredientCost,
    marketPrice: _marketPrice,
    nutrition: _nutrition,
    isCloneable: _isCloneable,
    // extractorId stripped: response uses hashed string, request DTO expects Long
    extractorId: _extractorId,
    // fields that need payload-specific mapping
    ingredients,
    steps,
    youtube,
    ...rest
  } = recipe;

  const ingredientPayloads: IngredientPayload[] = ingredients.map((ing) => ({
    id: ing.id,
    name: ing.name,
    quantity: ing.quantity ?? "",
    unit: ing.unit,
  }));

  const stepPayloads: RecipeStepPayload[] = steps.map((step) => ({
    stepNumber: step.stepNumber,
    instruction: step.instruction,
    ingredients: (step.ingredients ?? []).map((ing) => ({
      id: ing.id,
      name: ing.name,
      quantity: ing.quantity ?? "",
      unit: ing.unit,
    })),
    stepImageKey: step.stepImageKey,
  }));

  return {
    ...rest,
    youtubeUrl: youtube?.url,
    ingredients: ingredientPayloads,
    steps: stepPayloads,
    originRecipeId,
  };
};
