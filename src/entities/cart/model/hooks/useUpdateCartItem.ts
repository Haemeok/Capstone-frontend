import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApiLocale } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { type CartResponse, updateCartItem } from "@/entities/cart/api";

import { updateItemInCart } from "../cartTransforms";
import { CART_MESSAGES } from "../messages";
import { CART_QUERY_KEYS } from "../queryKeys";

type Variables = { cartItemId: string; quantity: string; unit: string };
type Context = { previous?: CartResponse };

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((s) => s.addToast);
  const lang = useApiLocale();

  return useMutation<void, Error, Variables, Context>({
    mutationFn: ({ cartItemId, quantity, unit }) =>
      updateCartItem(cartItemId, { quantity, unit }),
    onMutate: async ({ cartItemId, quantity, unit }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.all });
      const previous = queryClient.getQueryData<CartResponse>(
        CART_QUERY_KEYS.byLang(lang)
      );
      if (previous) {
        queryClient.setQueryData(
          CART_QUERY_KEYS.byLang(lang),
          updateItemInCart(previous, cartItemId, { quantity, unit })
        );
      }
      return { previous };
    },
    onSuccess: () => triggerHaptic("Success"),
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          CART_QUERY_KEYS.byLang(lang),
          context.previous
        );
      }
      addToast({ message: CART_MESSAGES.updateFailed, variant: "error" });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.all }),
  });
};
