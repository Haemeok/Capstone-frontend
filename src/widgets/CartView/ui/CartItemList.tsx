// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem, CartItemNameGroup } from "@/entities/cart";
import { groupCartItemsByName } from "@/entities/cart";

import { CartItemRow } from "./CartItemRow";

type ItemHandlers = {
  onEdit: (item: CartItem) => void;
  onDelete: (cartItemId: string) => void;
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

// 같은 재료를 여러 레시피에서 담은 경우 — 라벨 1번 + 레시피별 양 + 총량
const MultiRecipeGroup = ({
  group,
  onEdit,
  onDelete,
  selectable,
  selectedIds,
  onToggleSelect,
}: MultiRecipeGroupProps) => (
  <li className="py-2">
    <div className="flex items-baseline gap-2">
      <p className="text-ink truncate font-semibold">{group.name}</p>
      {group.totalAmount && (
        <span className="text-olive-dark shrink-0 text-sm font-semibold">
          총 {group.totalAmount}
        </span>
      )}
    </div>
    <ul className="mt-1 flex flex-col gap-1.5">
      {group.items.map((item) => (
        <li key={item.cartItemId} className="flex items-center gap-3">
          {selectable && (
            <input
              type="checkbox"
              checked={selectedIds.has(item.cartItemId)}
              onChange={() => {
                triggerHaptic("Light");
                onToggleSelect(item.cartItemId);
              }}
              aria-label={`${item.recipe.title} ${item.name} 선택`}
              className="accent-olive-light size-5"
            />
          )}
          <p className="text-ink-muted min-w-0 flex-1 truncate text-sm">
            {item.recipe.title}
          </p>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("Light");
              onEdit(item);
            }}
            aria-label={`${item.recipe.title} ${item.name} 수량 수정`}
            className="text-ink-sub shrink-0 text-sm"
          >
            {item.quantity}
            {item.unit}
          </button>
          {!selectable && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic("Light");
                onDelete(item.cartItemId);
              }}
              aria-label={`${item.recipe.title} ${item.name} 삭제`}
              className="text-ink-muted p-1"
            >
              ✕
            </button>
          )}
        </li>
      ))}
    </ul>
  </li>
);

export const CartItemList = ({ items, ...handlers }: CartItemListProps) => {
  const nameGroups = groupCartItemsByName(items);

  return (
    <ul className="flex flex-col divide-y divide-gray-50">
      {nameGroups.map((group) =>
        group.items.length === 1 ? (
          <CartItemRow
            key={group.items[0].cartItemId}
            item={group.items[0]}
            onEdit={handlers.onEdit}
            onDelete={handlers.onDelete}
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
