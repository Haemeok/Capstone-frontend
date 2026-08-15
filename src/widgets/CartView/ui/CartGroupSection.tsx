// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { triggerHaptic } from "@/shared/lib/bridge";

import type { CartGroup } from "@/entities/cart";

import { CartItemList } from "./CartItemList";
import { CartProductSlider } from "./CartProductSlider";

type CartGroupSectionProps = {
  group: CartGroup;
  onDelete: (cartItemIds: string[]) => void;
};

export const CartGroupSection = ({
  group,
  onDelete,
}: CartGroupSectionProps) => {
  const { coupangInfo, items } = group;
  const hasProducts = coupangInfo.products.length > 0;

  return (
    <section
      data-testid={`cart-group-${coupangInfo.coupangName}`}
      className="border-t-8 border-gray-100 bg-white px-4 py-5"
    >
      <CartItemList items={items} onDelete={onDelete} />
      {hasProducts ? (
        <CartProductSlider
          coupangName={coupangInfo.coupangName}
          products={coupangInfo.products}
        />
      ) : coupangInfo.landingUrl ? (
        <div className="mt-3 flex justify-end">
          <a
            href={coupangInfo.landingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic("Light")}
            className="text-olive-dark focus-visible:ring-olive-light flex min-h-11 cursor-pointer items-center rounded-lg px-2 text-sm font-semibold focus-visible:ring-2 focus-visible:outline-none"
          >
            쿠팡에서 보기
          </a>
        </div>
      ) : null}
    </section>
  );
};
