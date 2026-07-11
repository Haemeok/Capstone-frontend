"use client";

import { useState } from "react";

import { Check, ShoppingBasketIcon } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { convertIngredientQuantity } from "@/shared/lib/ingredientConversion";
import { useToastStore } from "@/shared/ui/toast";

import {
  CART_MAX_ITEMS,
  CART_MESSAGES,
  useAddCartItems,
  useGuestCartStore,
} from "@/entities/cart";
import { useUserStore } from "@/entities/user";

import { buildAddPayload } from "../model/buildAddPayload";

type CartRecipeSource = {
  recipeId: string;
  title: string;
  imageUrl: string | null;
};

type AddToCartButtonProps = {
  recipeIngredientId: string;
  name: string;
  quantity?: string;
  unit: string;
  servingRatio: number;
  recipe: CartRecipeSource;
};

export const AddToCartButton = ({
  recipeIngredientId,
  name,
  quantity,
  unit,
  servingRatio,
  recipe,
}: AddToCartButtonProps) => {
  const { user } = useUserStore();
  const [isAdded, setIsAdded] = useState(false);
  const { mutate: addItems, isPending } = useAddCartItems();
  const addGuestItems = useGuestCartStore((s) => s.addItems);
  const addToast = useToastStore((s) => s.addToast);

  const handleClick = () => {
    triggerHaptic("Light");
    if (!user) {
      const converted = convertIngredientQuantity(quantity, unit, servingRatio);
      const result = addGuestItems([
        {
          recipeIngredientId,
          name,
          quantity: converted.quantity,
          unit: converted.unit,
          recipe,
        },
      ]);
      if (result.addedCount > 0) {
        triggerHaptic("Success");
        addToast({ message: CART_MESSAGES.added, variant: "success" });
        setIsAdded(true);
      } else {
        const isFull =
          useGuestCartStore.getState().items.length >= CART_MAX_ITEMS;
        addToast({
          message: isFull
            ? CART_MESSAGES.limitExceeded
            : CART_MESSAGES.alreadyInCart,
          variant: isFull ? "warning" : "info",
        });
      }
      return;
    }
    const payload = buildAddPayload({
      recipeIngredientId,
      quantity,
      unit,
      servingRatio,
    });
    addItems({ items: [payload] }, { onSuccess: () => setIsAdded(true) });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      // i18n-ignore: 장바구니 ko 전용
      aria-label={isAdded ? "장바구니에 담았어요" : "장바구니에 담기"}
      className="border-olive-light/40 text-olive-dark rounded-md border p-[3px] disabled:opacity-50"
    >
      {isAdded ? (
        <Check data-testid="cart-added-check" size={18} />
      ) : (
        <ShoppingBasketIcon size={18} />
      )}
    </button>
  );
};
