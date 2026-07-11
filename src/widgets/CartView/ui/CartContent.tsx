// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useMemo, useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem, CartResponse } from "@/entities/cart";
import { filterCartByRecipe } from "@/entities/cart";

import { CartItemEditSheet } from "@/features/cart-item-edit";

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
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(EMPTY_SET);
  // 필터 중 해당 레시피가 전량 삭제되면 탭이 사라지므로 "전체"로 강등
  const validRecipeId =
    selectedRecipeId &&
    cart.recipes.some((recipe) => recipe.recipeId === selectedRecipeId)
      ? selectedRecipeId
      : null;
  const filtered = useMemo(
    () => filterCartByRecipe(cart, validRecipeId),
    [cart, validRecipeId]
  );

  const toggleSelect = (cartItemId: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cartItemId)) next.delete(cartItemId);
      else next.add(cartItemId);
      return next;
    });

  const exitSelectMode = () => {
    setIsSelectMode(false);
    setSelectedIds(EMPTY_SET);
  };

  if (cart.totalItemCount === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 pt-4 pb-24">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-ink text-xl font-bold">
          장바구니{" "}
          <span className="text-olive-dark">{cart.totalItemCount}</span>
        </h1>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            if (isSelectMode) exitSelectMode();
            else setIsSelectMode(true);
          }}
          className="text-ink-sub text-sm font-semibold"
        >
          {isSelectMode ? "취소" : "선택"}
        </button>
      </div>
      <RecipeTabBar
        recipes={cart.recipes}
        totalItemCount={cart.totalItemCount}
        selectedRecipeId={validRecipeId}
        onSelect={setSelectedRecipeId}
      />
      {filtered.groups.map((group) => (
        <CartGroupSection
          key={group.coupangInfo.coupangName}
          group={group}
          onEdit={setEditingItem}
          onDelete={(id) => handlers.onDeleteItems([id])}
          selectable={isSelectMode}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      ))}
      {filtered.unmatchedItems.length > 0 && (
        <section
          data-testid="cart-unmatched-section"
          className="rounded-card border border-gray-100 bg-white p-3"
        >
          <ul className="flex flex-col divide-y divide-gray-50">
            {filtered.unmatchedItems.map((item) => (
              <CartItemRow
                key={item.cartItemId}
                item={item}
                onEdit={setEditingItem}
                onDelete={(id) => handlers.onDeleteItems([id])}
                selectable={isSelectMode}
                selected={selectedIds.has(item.cartItemId)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </ul>
        </section>
      )}
      {isSelectMode && selectedIds.size > 0 && (
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Medium");
            handlers.onDeleteItems([...selectedIds]);
            exitSelectMode();
          }}
          className="bg-olive-light fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 rounded-full px-6 py-3 font-semibold text-white shadow-lg"
        >
          {selectedIds.size}개 삭제
        </button>
      )}
      <CartItemEditSheet
        item={editingItem}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
        onSubmit={(_cartItemId, next) => {
          if (editingItem) handlers.onEditItem(editingItem, next);
        }}
      />
    </div>
  );
};
