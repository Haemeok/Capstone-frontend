// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem, CartItemNameGroup } from "@/entities/cart";
import { CART_MESSAGES } from "@/entities/cart";

import { CartRecipeSourceRow } from "./CartRecipeSourceRow";

type CartIngredientGroupProps = {
  group: CartItemNameGroup;
  onDelete: (cartItemIds: string[]) => void;
};

const getAmount = (item: CartItem) => {
  const quantity = item.quantity.trim();
  if (!quantity) return CART_MESSAGES.missingAmount;
  return `${quantity}${item.unit.trim()}`;
};

const getHeadingAmount = (group: CartItemNameGroup) => {
  if (group.items.length === 1) return getAmount(group.items[0]);
  if (group.totalAmount) return `총 ${group.totalAmount}`;
  return null;
};

export const CartIngredientGroup = ({
  group,
  onDelete,
}: CartIngredientGroupProps) => {
  const ids = group.items.map((item) => item.cartItemId);
  const headingAmount = getHeadingAmount(group);

  return (
    <li data-testid={`cart-ingredient-${group.name}`} className="py-2">
      <div className="flex min-h-11 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h2 className="text-ink truncate text-lg font-bold">{group.name}</h2>
          {headingAmount ? (
            <span className="text-ink-sub shrink-0 text-base font-normal">
              {headingAmount}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            onDelete(ids);
          }}
          aria-label={`${group.name} 삭제`}
          className="text-ink-disabled hover:text-ink-sub focus-visible:ring-olive-light grid size-11 shrink-0 cursor-pointer place-items-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>
      <ul className="mt-0.5">
        {group.items.map((item) => (
          <li key={item.cartItemId}>
            <CartRecipeSourceRow
              recipe={item.recipe}
              amount={getAmount(item)}
            />
          </li>
        ))}
      </ul>
    </li>
  );
};
