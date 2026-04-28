import type { IngredientPayload } from "@/entities/ingredient";
import type { Recipe, RecipePayload, RecipeStepPayload } from "@/entities/recipe/model/types";

/**
 * 원본 레시피 detail을 리믹스용 RecipePayload로 변환한다.
 *
 * - originRecipeId 부착
 * - extractorId 제거 (백엔드 비대칭 이슈: 응답은 hashed string이지만 요청 DTO는 Long)
 * - ingredients/steps를 Payload 형태로 매핑
 * - 응답 전용 필드(author/ratingInfo/comments 등)는 RecipePayload 타입에서 이미 제외됨
 */
export const prepareRemixPayload = (
  recipe: Recipe,
  originRecipeId: string,
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
    private: _private,
    aiGenerated: _aiGenerated,
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
    ...rest
  } = recipe as Recipe & { extractorId?: unknown };

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
    ingredients: ingredientPayloads,
    steps: stepPayloads,
    originRecipeId,
  };
};
