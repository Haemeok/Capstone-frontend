// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem } from "@/entities/cart";
import { CART_MESSAGES } from "@/entities/cart";

import { CartRecipeLink } from "./CartRecipeLink";

type CartItemRowProps = {
  item: CartItem;
  recipeImageUrl?: string | null;
  onDelete: (cartItemId: string) => void;
};

export const CartItemRow = ({
  item,
  recipeImageUrl,
  onDelete,
}: CartItemRowProps) => {
  const amount = `${item.quantity}${item.unit}`.trim();

  return (
    <li className="flex items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-ink truncate text-xl font-semibold">{item.name}</p>
          <span
            className={
              amount
                ? "text-ink-sub shrink-0 text-lg"
                : "text-ink-muted truncate text-sm"
            }
          >
            {amount || CART_MESSAGES.missingAmount}
          </span>
        </div>
        <div className="mt-1 flex items-center">
          <CartRecipeLink recipe={item.recipe} imageUrl={recipeImageUrl} />
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          triggerHaptic("Light");
          onDelete(item.cartItemId);
        }}
        aria-label={`${item.name} 삭제`}
        className="text-ink-disabled hover:text-ink-sub -m-1 self-start rounded-full p-2 transition-colors"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </li>
  );
};
