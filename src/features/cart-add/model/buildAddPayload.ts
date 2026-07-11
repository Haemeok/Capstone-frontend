import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";

import type { AddCartItemInput } from "@/entities/cart";

type BuildAddPayloadArgs = {
  recipeIngredientId: string;
  quantity?: string;
  unit: string;
  servingRatio: number;
};

// 기본 인분이면 서버 저장값을 쓰도록 필드 생략, 인분수 변경 시에만 환산값 캡처
export const buildAddPayload = ({
  recipeIngredientId,
  quantity,
  unit,
  servingRatio,
}: BuildAddPayloadArgs): AddCartItemInput => {
  if (servingRatio === 1) {
    return { recipeIngredientId };
  }
  const converted = convertIngredientQuantity(quantity, unit, servingRatio);
  if (converted.quantity === "") {
    return { recipeIngredientId };
  }
  return {
    recipeIngredientId,
    quantity: converted.quantity,
    unit: converted.unit,
  };
};
