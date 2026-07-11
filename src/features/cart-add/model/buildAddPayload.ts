import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";

import type { AddCartItemInput } from "@/entities/cart";

type BuildAddPayloadArgs = {
  recipeIngredientId: string;
  quantity?: string;
  unit: string;
  servingRatio: number;
};

// 서버는 quantity 생략 시 원본 수량 fallback 없이 null로 저장하므로 항상 환산값을 보냄
export const buildAddPayload = ({
  recipeIngredientId,
  quantity,
  unit,
  servingRatio,
}: BuildAddPayloadArgs): AddCartItemInput => {
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
