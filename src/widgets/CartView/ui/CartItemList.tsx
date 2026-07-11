// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem, CartItemNameGroup } from "@/entities/cart";
import { CART_MESSAGES, groupCartItemsByName } from "@/entities/cart";

import { CartItemRow } from "./CartItemRow";
import { CartRecipeLink } from "./CartRecipeLink";

type ItemHandlers = {
  recipeImages: Map<string, string | null>;
  onEdit: (item: CartItem) => void;
  onDelete: (cartItemIds: string[]) => void;
  selectable: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (cartItemId: string) => void;
};

type CartItemListProps = ItemHandlers & {
  items: CartItem[];
};

type MultiRecipeGroupProps = ItemHandlers & {
  group: CartItemNameGroup;
};

// 같은 재료를 여러 레시피에서 담은 경우 — 하나의 항목 블록: 라벨·총량·삭제 1개 + 레시피별 양
const MultiRecipeGroup = ({
  group,
  recipeImages,
  onEdit,
  onDelete,
  selectable,
  selectedIds,
  onToggleSelect,
}: MultiRecipeGroupProps) => {
  const ids = group.items.map((item) => item.cartItemId);
  const allSelected = ids.every((id) => selectedIds.has(id));

  return (
    <li className="flex gap-3 py-2">
      {selectable && (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() => {
            triggerHaptic("Light");
            ids.forEach(onToggleSelect);
          }}
          aria-label={`${group.name} 선택`}
          className="accent-olive-light size-5 self-center"
        />
      )}
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
        <ul className="mt-1 flex flex-col gap-1">
          {group.items.map((item) => {
            const amount = `${item.quantity}${item.unit}`.trim();
            return (
              <li key={item.cartItemId} className="flex items-center gap-2">
                <CartRecipeLink
                  recipe={item.recipe}
                  imageUrl={recipeImages.get(item.recipe.recipeId)}
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("Light");
                    onEdit(item);
                  }}
                  aria-label={`${item.recipe.title} ${item.name} 수량 수정`}
                  className={
                    amount
                      ? "text-ink-sub shrink-0 text-lg"
                      : "text-ink-muted shrink-0 truncate text-sm"
                  }
                >
                  {amount || CART_MESSAGES.missingAmount}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {!selectable && (
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            onDelete(ids);
          }}
          aria-label={`${group.name} 삭제`}
          className="text-ink-muted self-start p-1"
        >
          ✕
        </button>
      )}
    </li>
  );
};

export const CartItemList = ({ items, ...handlers }: CartItemListProps) => {
  const nameGroups = groupCartItemsByName(items);

  return (
    <ul className="flex flex-col divide-y divide-gray-50">
      {nameGroups.map((group) =>
        group.items.length === 1 ? (
          <CartItemRow
            key={group.items[0].cartItemId}
            item={group.items[0]}
            recipeImageUrl={handlers.recipeImages.get(
              group.items[0].recipe.recipeId
            )}
            onEdit={handlers.onEdit}
            onDelete={(id) => handlers.onDelete([id])}
            selectable={handlers.selectable}
            selected={handlers.selectedIds.has(group.items[0].cartItemId)}
            onToggleSelect={handlers.onToggleSelect}
          />
        ) : (
          <MultiRecipeGroup key={group.name} group={group} {...handlers} />
        )
      )}
    </ul>
  );
};
