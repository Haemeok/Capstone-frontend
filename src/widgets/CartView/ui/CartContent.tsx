// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useMemo, useState } from "react";

import type { CartItem, CartResponse } from "@/entities/cart";
import { filterCartByRecipe } from "@/entities/cart";

import { CartEmptyState } from "./CartEmptyState";
import { CartGroupSection } from "./CartGroupSection";
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

const EMPTY_SET = new Set<string>();

export const CartContent = ({ cart, handlers }: CartContentProps) => {
  void handlers;
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const filtered = useMemo(
    () => filterCartByRecipe(cart, selectedRecipeId),
    [cart, selectedRecipeId]
  );

  if (cart.totalItemCount === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 pt-4 pb-24">
      <h1 className="text-ink mb-1 text-xl font-bold">
        장바구니 <span className="text-olive-dark">{cart.totalItemCount}</span>
      </h1>
      <RecipeTabBar
        recipes={cart.recipes}
        totalItemCount={cart.totalItemCount}
        selectedRecipeId={selectedRecipeId}
        onSelect={setSelectedRecipeId}
      />
      {filtered.groups.map((group) => (
        <CartGroupSection
          key={group.coupangInfo.coupangName}
          group={group}
          onEdit={() => {}}
          onDelete={() => {}}
          selectable={false}
          selectedIds={EMPTY_SET}
          onToggleSelect={() => {}}
        />
      ))}
      {filtered.unmatchedItems.length > 0 && (
        <section
          data-testid="cart-unmatched-section"
          className="rounded-card border border-gray-100 bg-white p-3"
        >
          <ul className="flex flex-col divide-y divide-gray-50">
            {filtered.unmatchedItems.map((item) => (
              <CartItemRow key={item.cartItemId} item={item} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
