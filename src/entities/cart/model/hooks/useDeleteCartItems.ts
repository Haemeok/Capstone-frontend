import { useMutation, useQueryClient } from "@tanstack/react-query";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import {
  type CartResponse,
  deleteCartItem,
  deleteCartItemsBulk,
} from "@/entities/cart/api";

import { removeItemsFromCart } from "../cartTransforms";
import { CART_MESSAGES } from "../messages";
import { CART_QUERY_KEYS } from "../queryKeys";

type Variables = { cartItemIds: string[] };
type Context = { previous?: CartResponse };

export const useDeleteCartItems = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);

  return useMutation<void, Error, Variables, Context>({
    mutationFn: ({ cartItemIds }) =>
      cartItemIds.length === 1
        ? deleteCartItem(cartItemIds[0])
        : deleteCartItemsBulk(cartItemIds),
    onMutate: async ({ cartItemIds }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.all });
      const previous = queryClient.getQueryData<CartResponse>(
        CART_QUERY_KEYS.all
      );
      if (previous) {
        queryClient.setQueryData(
          CART_QUERY_KEYS.all,
          removeItemsFromCart(previous, cartItemIds)
        );
      }
      return { previous };
    },
    onSuccess: () => triggerHaptic("Success"),
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CART_QUERY_KEYS.all, context.previous);
      }
      addToast({ message: CART_MESSAGES.deleteFailed, variant: "error" });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all }),
  });
};
