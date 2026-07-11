// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useMemo, useState } from "react";

import type { CartItem, CartResponse } from "@/entities/cart";
import { filterCartByRecipe } from "@/entities/cart";

import { CartItemRow } from "./CartItemRow";
import { RecipeTabBar } from "./RecipeTabBar";

export type CartHandlers = {
  onEditItem: (
    item: CartItem,
    next: { quantity: string; unit: string }
  ) => void;
  onDeleteItems: (cartItemIds: string[]) => void;
};

type CartContentProps = {
  cart: CartResponse;
  handlers: CartHandlers;
};

export const CartContent = ({ cart, handlers }: CartContentProps) => {
  void handlers;
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const filtered = useMemo(
    () => filterCartByRecipe(cart, selectedRecipeId),
    [cart, selectedRecipeId]
  );
  const allItems = [
    ...filtered.groups.flatMap((group) => group.items),
    ...filtered.unmatchedItems,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-24">
      <h1 className="text-ink mb-4 text-xl font-bold">
        장바구니 <span className="text-olive-dark">{cart.totalItemCount}</span>
      </h1>
      <RecipeTabBar
        recipes={cart.recipes}
        totalItemCount={cart.totalItemCount}
        selectedRecipeId={selectedRecipeId}
        onSelect={setSelectedRecipeId}
      />
      <ul className="flex flex-col divide-y divide-gray-100">
        {allItems.map((item) => (
          <CartItemRow key={item.cartItemId} item={item} />
        ))}
      </ul>
    </div>
  );
};
