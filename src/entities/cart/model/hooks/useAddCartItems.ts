import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, getErrorData } from "@/shared/api/errors";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import {
  addCartItems,
  type AddCartItemsRequest,
  type AddCartItemsResponse,
  CART_ERROR_CODES,
} from "@/entities/cart/api";

import { CART_MESSAGES } from "../messages";
import { CART_QUERY_KEYS } from "../queryKeys";

const isCartLimitError = (error: unknown): boolean =>
  ApiError.isApiError(error) &&
  String(getErrorData(error)?.code ?? "") === CART_ERROR_CODES.LIMIT_EXCEEDED;

export const useAddCartItems = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation<AddCartItemsResponse, Error, AddCartItemsRequest>({
    mutationFn: addCartItems,
    onSuccess: (data) => {
      triggerHaptic("Success");
      if (data.addedCount === 0 && data.skippedCount > 0) {
        addToast({ message: CART_MESSAGES.alreadyInCart, variant: "info" });
      } else {
        addToast({ message: CART_MESSAGES.added, variant: "success" });
      }
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all });
    },
    onError: (error) => {
      const isLimit = isCartLimitError(error);
      addToast({
        message: isLimit
          ? CART_MESSAGES.limitExceeded
          : CART_MESSAGES.addFailed,
        variant: isLimit ? "warning" : "error",
      });
    },
  });
};
