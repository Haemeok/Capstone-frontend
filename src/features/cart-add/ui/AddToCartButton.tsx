"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Check, ShoppingBasketIcon } from "lucide-react";

import { triggerHaptic } from "@/shared/lib/bridge";

import { useAddCartItems } from "@/entities/cart";
import { useUserStore } from "@/entities/user";

import { buildAddPayload } from "../model/buildAddPayload";

// eslint-disable-next-line local/fsd-import -- 임시 로그인 게이트: 게스트 로컬 담기 도입 시 이 import째 제거 예정
const LoginDialog = dynamic(() => import("@/features/auth/ui/LoginDialog"), {
  ssr: false,
});

type CartRecipeSource = {
  recipeId: string;
  title: string;
  imageUrl: string | null;
};

type AddToCartButtonProps = {
  recipeIngredientId: string;
  name: string;
  quantity?: string;
  unit: string;
  servingRatio: number;
  recipe: CartRecipeSource;
};

export const AddToCartButton = ({
  recipeIngredientId,
  name,
  quantity,
  unit,
  servingRatio,
  recipe,
}: AddToCartButtonProps) => {
  const { user } = useUserStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { mutate: addItems, isPending } = useAddCartItems();

  // name/recipe는 후속 게스트 담기 태스크에서 로컬 저장에 사용
  void name;
  void recipe;

  const handleClick = () => {
    triggerHaptic("Light");
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    const payload = buildAddPayload({
      recipeIngredientId,
      quantity,
      unit,
      servingRatio,
    });
    addItems({ items: [payload] }, { onSuccess: () => setIsAdded(true) });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        // i18n-ignore: 장바구니 ko 전용
        aria-label={isAdded ? "장바구니에 담았어요" : "장바구니에 담기"}
        className="border-olive-light/40 text-olive-dark rounded-md border p-[3px] disabled:opacity-50"
      >
        {isAdded ? (
          <Check data-testid="cart-added-check" size={18} />
        ) : (
          <ShoppingBasketIcon size={18} />
        )}
      </button>
      {isLoginOpen && (
        <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      )}
    </>
  );
};
