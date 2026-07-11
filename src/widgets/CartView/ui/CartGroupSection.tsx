// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { CoupangProductCard } from "@/shared/coupang";
import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartGroup, CartItem } from "@/entities/cart";

import { CartItemList } from "./CartItemList";

type CartGroupSectionProps = {
  group: CartGroup;
  onEdit: (item: CartItem) => void;
  onDelete: (cartItemIds: string[]) => void;
  selectable: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (cartItemId: string) => void;
};

const SCROLL_STEP = 280;

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
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollProducts = (direction: -1 | 1) => {
    sliderRef.current?.scrollBy({
      left: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  };

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
        <div className="relative mt-1">
          <div
            ref={sliderRef}
            className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
          >
            {coupangInfo.products.map((product) => (
              <CoupangProductCard key={product.rank} product={product} />
            ))}
          </div>
          {coupangInfo.products.length > 4 && (
            <>
              <button
                type="button"
                onClick={() => scrollProducts(-1)}
                aria-label={`${coupangInfo.coupangName} 상품 이전으로`}
                className="text-ink-sub absolute top-[66px] -left-4 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md md:flex"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollProducts(1)}
                aria-label={`${coupangInfo.coupangName} 상품 다음으로`}
                className="text-ink-sub absolute top-[66px] -right-4 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md md:flex"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
};
