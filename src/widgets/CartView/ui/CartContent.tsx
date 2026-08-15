// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useMemo, useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { DeleteModal } from "@/shared/ui/modal/DeleteModal";

import type { CartResponse } from "@/entities/cart";
import { filterCartByRecipe } from "@/entities/cart";

import { CartEmptyState } from "./CartEmptyState";
import { CartGroupSection } from "./CartGroupSection";
import { CartItemList } from "./CartItemList";
import { RecipeFilterBar } from "./RecipeFilterBar";

export type CartHandlers = {
  onDeleteItems: (cartItemIds: string[]) => void;
};

type CartContentProps = {
  cart: CartResponse;
  handlers: CartHandlers;
};

export const CartContent = ({ cart, handlers }: CartContentProps) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
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
  const recipeImages = useMemo(
    () =>
      new Map(cart.recipes.map((recipe) => [recipe.recipeId, recipe.imageUrl])),
    [cart.recipes]
  );

  const clearAll = () => {
    const allIds = [
      ...cart.groups.flatMap((group) => group.items),
      ...cart.unmatchedItems,
    ].map((item) => item.cartItemId);
    handlers.onDeleteItems(allIds);
    setIsClearConfirmOpen(false);
  };

  if (cart.totalItemCount === 0) {
    return (
      <div
        data-testid="cart-content"
        className="mx-auto flex w-full max-w-2xl flex-col overflow-x-hidden bg-white pb-24"
      >
        <div className="flex min-h-[60px] items-center border-b border-gray-100 px-4">
          <h1 className="text-ink text-2xl font-bold">장바구니</h1>
        </div>
        <CartEmptyState />
      </div>
    );
  }

  return (
    <div
      data-testid="cart-content"
      className="mx-auto flex w-full max-w-2xl flex-col overflow-x-hidden bg-white pb-24"
    >
      <div className="sticky top-0 z-30 flex min-h-[60px] items-center justify-between border-b border-gray-100 bg-white px-4">
        <h1 className="text-ink text-2xl font-bold">장바구니</h1>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            setIsClearConfirmOpen(true);
          }}
          className="text-ink-muted min-h-11 cursor-pointer px-1 text-sm"
        >
          전체 비우기
        </button>
      </div>
      <RecipeFilterBar
        recipes={cart.recipes}
        totalItemCount={cart.totalItemCount}
        selectedRecipeId={validRecipeId}
        onSelect={setSelectedRecipeId}
      />
      <p className="text-ink-muted px-4 pb-3 text-[11px] leading-[1.45] font-normal break-keep">
        이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
        제공받습니다.
      </p>
      {filtered.groups.map((group) => (
        <CartGroupSection
          key={group.coupangInfo.coupangName}
          group={group}
          recipeImages={recipeImages}
          onDelete={handlers.onDeleteItems}
        />
      ))}
      {filtered.unmatchedItems.length > 0 ? (
        <section
          data-testid="cart-unmatched-section"
          className="border-t-8 border-gray-100 bg-white px-4 py-5"
        >
          <CartItemList
            items={filtered.unmatchedItems}
            recipeImages={recipeImages}
            onDelete={handlers.onDeleteItems}
          />
        </section>
      ) : null}
      <DeleteModal
        open={isClearConfirmOpen}
        onOpenChange={setIsClearConfirmOpen}
        title="장바구니를 모두 비울까요?"
        description="담아둔 재료가 모두 삭제돼요."
        confirmLabel="비우기"
        cancelLabel="취소"
        onConfirm={clearAll}
      />
    </div>
  );
};
