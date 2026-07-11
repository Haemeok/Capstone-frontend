// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { CoupangProductCard } from "@/shared/coupang";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartGroup, CartItem } from "@/entities/cart";

import { CartItemRow } from "./CartItemRow";

type CartGroupSectionProps = {
  group: CartGroup;
  onEdit: (item: CartItem) => void;
  onDelete: (cartItemId: string) => void;
  selectable: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (cartItemId: string) => void;
};

export const CartGroupSection = ({
  group,
  onEdit,
  onDelete,
  selectable,
  selectedIds,
  onToggleSelect,
}: CartGroupSectionProps) => {
  const { coupangInfo, items } = group;
  const hasProducts = coupangInfo.products.length > 0;

  return (
    <section
      data-testid={`cart-group-${coupangInfo.coupangName}`}
      className="rounded-card border border-gray-100 bg-white p-3"
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <h2 className="text-ink font-bold">{coupangInfo.coupangName}</h2>
        {!hasProducts && coupangInfo.landingUrl && (
          <a
            href={coupangInfo.landingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("Light")}
            className="text-olive-dark text-sm font-semibold"
          >
            쿠팡에서 보기
          </a>
        )}
      </div>
      <ul className="flex flex-col divide-y divide-gray-50">
        {items.map((item) => (
          <CartItemRow
            key={item.cartItemId}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            selectable={selectable}
            selected={selectedIds.has(item.cartItemId)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </ul>
      {hasProducts && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {coupangInfo.products.map((product) => (
            <CoupangProductCard key={product.rank} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
