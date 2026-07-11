// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useCart } from "@/entities/cart";
import { useUserStore } from "@/entities/user";

import { CartContent, type CartHandlers } from "./ui/CartContent";

const noopHandlers: CartHandlers = {
  onEditItem: () => {},
  onDeleteItems: () => {},
};

const CartView = () => {
  const { user, isAuthReady } = useUserStore();
  const { data: cart, isPending } = useCart({ enabled: isAuthReady && !!user });

  if (!isAuthReady || (user && isPending)) {
    return <div className="p-8" aria-busy="true" />;
  }
  if (!cart) return null;

  return <CartContent cart={cart} handlers={noopHandlers} />;
};

export default CartView;
