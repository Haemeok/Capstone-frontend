// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { X } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem, CartItemNameGroup } from "@/entities/cart";
import { CART_MESSAGES, groupCartItemsByName } from "@/entities/cart";

import { CartItemRow } from "./CartItemRow";
import { CartRecipeLink } from "./CartRecipeLink";

type CartItemListProps = {
  items: CartItem[];
  recipeImages: Map<string, string | null>;
  onDelete: (cartItemIds: string[]) => void;
};

type MultiRecipeGroupProps = {
  group: CartItemNameGroup;
  recipeImages: Map<string, string | null>;
  onDelete: (cartItemIds: string[]) => void;
};

// 같은 재료를 여러 레시피에서 담은 경우 — 하나의 항목 블록: 라벨·총량·삭제 1개 + 레시피별 양
const MultiRecipeGroup = ({
  group,
  recipeImages,
  onDelete,
}: MultiRecipeGroupProps) => {
  const ids = group.items.map((item) => item.cartItemId);

  return (
    <li className="flex gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-ink truncate text-xl font-semibold">
            {group.name}
          </p>
          {group.totalAmount && (
            <span className="text-olive-dark shrink-0 text-lg font-semibold">
              총 {group.totalAmount}
            </span>
          )}
        </div>
        <ul className="mt-1 flex flex-col gap-1.5">
          {group.items.map((item) => {
            const amount = `${item.quantity}${item.unit}`.trim();
            return (
              <li key={item.cartItemId} className="flex items-center gap-2">
                <CartRecipeLink
                  recipe={item.recipe}
                  imageUrl={recipeImages.get(item.recipe.recipeId)}
                />
                <span
                  className={
                    amount
                      ? "text-ink-sub shrink-0 text-lg"
                      : "text-ink-muted truncate text-sm"
                  }
                >
                  {amount || CART_MESSAGES.missingAmount}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => {
          triggerHaptic("Light");
          onDelete(ids);
        }}
        aria-label={`${group.name} 삭제`}
        className="text-ink-disabled hover:text-ink-sub -m-1 self-start rounded-full p-2 transition-colors"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </li>
  );
};

export const CartItemList = ({
  items,
  recipeImages,
  onDelete,
}: CartItemListProps) => {
  const nameGroups = groupCartItemsByName(items);

  return (
    <ul className="flex flex-col divide-y divide-gray-50">
      {nameGroups.map((group) =>
        group.items.length === 1 ? (
          <CartItemRow
            key={group.items[0].cartItemId}
            item={group.items[0]}
            recipeImageUrl={recipeImages.get(group.items[0].recipe.recipeId)}
            onDelete={(id) => onDelete([id])}
          />
        ) : (
          <MultiRecipeGroup
            key={group.name}
            group={group}
            recipeImages={recipeImages}
            onDelete={onDelete}
          />
        )
      )}
    </ul>
  );
};
