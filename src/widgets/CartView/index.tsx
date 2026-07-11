// i18n-ignore-file: 장바구니 ko 전용
"use client";

import {
  useCart,
  useDeleteCartItems,
  useUpdateCartItem,
} from "@/entities/cart";
import { useUserStore } from "@/entities/user";

import { CartContent, type CartHandlers } from "./ui/CartContent";

const CartView = () => {
  const { user, isAuthReady } = useUserStore();
  const { data: cart, isPending } = useCart({ enabled: isAuthReady && !!user });
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: deleteItems } = useDeleteCartItems();

  if (!isAuthReady || (user && isPending)) {
    return <div className="p-8" aria-busy="true" />;
  }
  if (!cart) return null;

  const handlers: CartHandlers = {
    onEditItem: (item, next) =>
      updateItem({ cartItemId: item.cartItemId, ...next }),
    onDeleteItems: (cartItemIds) => deleteItems({ cartItemIds }),
  };

  return <CartContent cart={cart} handlers={handlers} />;
};

export default CartView;
