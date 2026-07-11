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
import { RecipeTabBar } from "./RecipeTabBar";

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
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 pb-24">
        <div className="-mx-4 bg-white px-4 py-3">
          <h1 className="text-ink text-2xl font-bold">장바구니</h1>
        </div>
        <CartEmptyState />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 pb-24">
      {/* 스크롤 컨테이너(RootLayout)가 데스크톱 고정 헤더 아래에서 시작하므로 top-0 */}
      <div className="sticky top-0 z-30 -mx-4 flex items-center justify-between bg-white px-4 py-3">
        <h1 className="text-ink text-2xl font-bold">장바구니</h1>
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            setIsClearConfirmOpen(true);
          }}
          className="text-ink-muted text-sm"
        >
          전체 비우기
        </button>
      </div>
      <RecipeTabBar
        recipes={cart.recipes}
        totalItemCount={cart.totalItemCount}
        selectedRecipeId={validRecipeId}
        onSelect={setSelectedRecipeId}
      />
      <p className="text-ink-muted text-[11px] leading-tight font-light break-keep">
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
      {filtered.unmatchedItems.length > 0 && (
        <section data-testid="cart-unmatched-section">
          <CartItemList
            items={filtered.unmatchedItems}
            recipeImages={recipeImages}
            onDelete={handlers.onDeleteItems}
          />
        </section>
      )}
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
