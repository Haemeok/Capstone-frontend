// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { CoupangProductCard } from "@/shared/coupang";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartGroup, CartItem } from "@/entities/cart";

import { CartItemList } from "./CartItemList";

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
    <section data-testid={`cart-group-${coupangInfo.coupangName}`}>
      <CartItemList
        items={items}
        onEdit={onEdit}
        onDelete={onDelete}
        selectable={selectable}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
      />
      {!hasProducts && coupangInfo.landingUrl && (
        <div className="flex justify-end">
          <a
            href={coupangInfo.landingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("Light")}
            className="text-olive-dark text-sm font-semibold"
          >
            쿠팡에서 보기
          </a>
        </div>
      )}
      {hasProducts && (
        <div className="scrollbar-hide -mx-4 mt-1 flex gap-2 overflow-x-auto px-4 pb-1">
          {coupangInfo.products.map((product) => (
            <CoupangProductCard key={product.rank} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
