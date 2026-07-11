// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartItem } from "@/entities/cart";

type CartItemRowProps = {
  item: CartItem;
  onEdit?: (item: CartItem) => void;
  onDelete?: (cartItemId: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (cartItemId: string) => void;
};

export const CartItemRow = ({
  item,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onToggleSelect,
}: CartItemRowProps) => {
  const amountLabel = `${item.quantity}${item.unit}`.trim() || "수량 입력";

  return (
    <li className="flex items-center gap-3 py-2">
      {selectable && (
        <input
          type="checkbox"
          checked={selected}
          onChange={() => {
            triggerHaptic("Light");
            onToggleSelect?.(item.cartItemId);
          }}
          aria-label={`${item.name} 선택`}
          className="accent-olive-light size-5"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-ink truncate font-semibold">{item.name}</p>
          <button
            type="button"
            onClick={() => {
              triggerHaptic("Light");
              onEdit?.(item);
            }}
            aria-label={`${item.name} 수량 수정`}
            className="text-ink-sub shrink-0 text-sm"
          >
            {amountLabel}
          </button>
        </div>
        <p className="text-ink-muted text-xs">{item.recipe.title}</p>
      </div>
      {!selectable && (
        <button
          type="button"
          onClick={() => {
            triggerHaptic("Light");
            onDelete?.(item.cartItemId);
          }}
          aria-label={`${item.name} 삭제`}
          className="text-ink-muted p-1"
        >
          ✕
        </button>
      )}
    </li>
  );
};
