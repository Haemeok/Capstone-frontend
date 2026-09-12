"use client";

import { useState } from "react";

import { Check, ShoppingBasketIcon } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { useToastStore } from "@/shared/ui/toast";

import { CART_MESSAGES } from "@/entities/cart";

import type { AddCartItemArgs } from "../model/types";
import { useAddCartItems } from "../model/useAddCartItems";

export const AddToCartButton = (item: AddCartItemArgs) => {
  const [isAdded, setIsAdded] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const { handleAddItems, isPending } = useAddCartItems(item);

  const handleClick = async () => {
    triggerHaptic("Light");
    const result = await handleAddItems();

    switch (result.status) {
      case "added":
        setIsAdded(true);
        triggerHaptic("Success");
        addToast({ message: CART_MESSAGES.added, variant: "success" });
        break;
      case "duplicate":
        addToast({ message: CART_MESSAGES.alreadyInCart, variant: "info" });
        break;
      case "limitExceeded":
        addToast({ message: CART_MESSAGES.limitExceeded, variant: "warning" });
        break;
      case "failed":
        addToast({ message: CART_MESSAGES.addFailed, variant: "error" });
        break;
    }
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
