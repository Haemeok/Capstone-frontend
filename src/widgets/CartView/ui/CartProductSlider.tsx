// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { type CoupangProduct, CoupangProductCard } from "@/shared/coupang";
import { triggerHaptic } from "@/shared/lib/bridge";

import { sortCoupangProducts } from "@/entities/cart";

type CartProductSliderProps = {
  coupangName: string;
  products: CoupangProduct[];
};

const SCROLL_STEP = 280;

export const CartProductSlider = ({
  coupangName,
  products,
}: CartProductSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sortedProducts = sortCoupangProducts(products);

  const scrollProducts = (direction: -1 | 1) => {
    triggerHaptic("Light");
    sliderRef.current?.scrollBy({
      left: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-ink text-base font-bold">
          이 재료로 많이 담는 상품
        </h3>
        <span className="text-ink-muted text-xs font-medium">옆으로 보기</span>
      </div>
      <div
        ref={sliderRef}
        data-testid="coupang-product-slider"
        className="scrollbar-hide -mr-4 flex gap-2 overflow-x-auto pr-4 pb-1"
      >
        {sortedProducts.map((product) => (
          <CoupangProductCard key={product.rank} product={product} />
        ))}
      </div>
      {sortedProducts.length > 4 ? (
        <>
          <button
            type="button"
            onClick={() => scrollProducts(-1)}
            aria-label={`${coupangName} 상품 이전으로`}
            className="text-ink-sub focus-visible:ring-olive-light absolute top-[90px] -left-4 hidden size-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-md focus-visible:ring-2 focus-visible:outline-none md:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollProducts(1)}
            aria-label={`${coupangName} 상품 다음으로`}
            className="text-ink-sub focus-visible:ring-olive-light absolute top-[90px] -right-4 hidden size-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-md focus-visible:ring-2 focus-visible:outline-none md:flex"
          >
            <ChevronRight size={18} />
          </button>
        </>
      ) : null}
    </div>
  );
};
