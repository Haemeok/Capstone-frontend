"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, getErrorData } from "@/shared/api/errors";
import { useApiLocale } from "@/shared/i18n";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";

import {
  addCartItems,
  CART_ERROR_CODES,
  CART_MAX_ITEMS,
  CART_QUERY_KEYS,
  useGuestCartStore,
} from "@/entities/cart";
import { useUserStore } from "@/entities/user";

import { buildAddPayload } from "./buildAddPayload";
import type { AddCartItemArgs, AddCartResult } from "./types";

export const useAddCartItems = (item: AddCartItemArgs) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const lang = useApiLocale();
  const addGuestItems = useGuestCartStore((state) => state.addItems);

  const mutation = useMutation<AddCartResult, Error, void>({
    mutationFn: async () => {
      if (!user) {
        const converted = convertIngredientQuantity(
          item.quantity,
          item.unit,
          item.servingRatio
        );
        const result = addGuestItems([
          {
            recipeIngredientId: item.recipeIngredientId,
            name: item.name,
            quantity: converted.quantity,
            unit: converted.unit,
            recipe: item.recipe,
          },
        ]);
        if (result.addedCount > 0) {
          return { status: "added", addedCount: result.addedCount };
        }
        const { items } = useGuestCartStore.getState();
        if (
          items.some(
            (stored) => stored.recipeIngredientId === item.recipeIngredientId
          )
        ) {
          return { status: "duplicate" };
        }
        return {
          status: items.length >= CART_MAX_ITEMS ? "limitExceeded" : "failed",
        };
      }

      const data = await addCartItems({ items: [buildAddPayload(item)] }, lang);
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
      if (data.addedCount > 0) {
        return { status: "added", addedCount: data.addedCount };
      }
      return { status: data.skippedCount > 0 ? "duplicate" : "failed" };
    },
  });

  const handleAddItems = async (): Promise<AddCartResult> => {
    try {
      return await mutation.mutateAsync();
    } catch (error) {
      const isLimit =
        ApiError.isApiError(error) &&
        String(getErrorData(error)?.code ?? "") ===
          CART_ERROR_CODES.LIMIT_EXCEEDED;
      return { status: isLimit ? "limitExceeded" : "failed" };
    }
  };

  return { handleAddItems, isPending: mutation.isPending };
};
