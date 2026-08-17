import type { CookingRecordCreateInput } from "../record";

export const cookingRecordCreateTypeGate = () => {
  const recipe: CookingRecordCreateInput = {
    sourceType: "RECIPE",
    recipeId: "recipe-A",
  };
  const manual: CookingRecordCreateInput = {
    sourceType: "MANUAL",
    recordTitle: "야식 볶음밥",
    image: { originalKey: "original-A" },
  };

  // @ts-expect-error RECIPE에서는 cookedAt을 보낼 수 없습니다.
  const recipeWithCookedAt: CookingRecordCreateInput = {
    sourceType: "RECIPE",
    recipeId: "recipe-A",
    cookedAt: "2026-08-17T12:00:00+09:00",
  };
  // @ts-expect-error MANUAL에는 recipeId를 보낼 수 없습니다.
  const manualWithRecipe: CookingRecordCreateInput = {
    sourceType: "MANUAL",
    recipeId: "recipe-A",
    recordTitle: "야식 볶음밥",
    image: { originalKey: "original-A" },
  };
  // @ts-expect-error MANUAL에는 제목이 필요합니다.
  const manualWithoutTitle: CookingRecordCreateInput = {
    sourceType: "MANUAL",
    image: { originalKey: "original-A" },
  };
  // @ts-expect-error MANUAL에는 이미지가 필요합니다.
  const manualWithoutImage: CookingRecordCreateInput = {
    sourceType: "MANUAL",
    recordTitle: "야식 볶음밥",
  };
  // @ts-expect-error MANUAL에서는 공개 후기 필드를 보낼 수 없습니다.
  const manualWithReview: CookingRecordCreateInput = {
    sourceType: "MANUAL",
    recordTitle: "야식 볶음밥",
    image: { originalKey: "original-A" },
    publishReview: true,
  };

  return {
    recipe,
    manual,
    recipeWithCookedAt,
    manualWithRecipe,
    manualWithoutTitle,
    manualWithoutImage,
    manualWithReview,
  };
};
