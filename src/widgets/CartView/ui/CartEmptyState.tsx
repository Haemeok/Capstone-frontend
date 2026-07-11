// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { ShoppingCart } from "lucide-react";

import { LocalizedLink } from "@/shared/i18n";
import { triggerHaptic } from "@/shared/lib/bridge";

export const CartEmptyState = () => (
  <div className="flex flex-col items-center gap-4 py-20">
    <ShoppingCart size={48} className="text-ink-disabled" />
    <p className="text-ink-sub text-center">
      아직 담긴 재료가 없어요.
      <br />
      레시피에서 재료를 담아보세요.
    </p>
    <LocalizedLink
      href="/search/results"
      onClick={() => triggerHaptic("Light")}
      className="bg-olive-light rounded-full px-5 py-2.5 font-semibold text-white"
    >
      지금 바로 재료 담으러 가기
    </LocalizedLink>
  </div>
);
