// i18n-ignore-file: 장바구니 ko 전용
"use client";

import {
  useCart,
  useDeleteCartItems,
  useGuestCartStore,
  useGuestCartView,
  useUpdateCartItem,
} from "@/entities/cart";
import { useUserStore } from "@/entities/user";

import { CartContent, type CartHandlers } from "./ui/CartContent";
import { GuestLoginBanner } from "./ui/GuestLoginBanner";

const CartView = () => {
  const { user, isAuthReady } = useUserStore();

  const serverCart = useCart({ enabled: isAuthReady && !!user });
  const guestCart = useGuestCartView({ enabled: isAuthReady && !user });

  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: deleteItems } = useDeleteCartItems();
  const updateGuestItem = useGuestCartStore((s) => s.updateItem);
  const removeGuestItems = useGuestCartStore((s) => s.removeItems);

  const handlers: CartHandlers = user
    ? {
        onEditItem: (item, next) =>
          updateItem({ cartItemId: item.cartItemId, ...next }),
        onDeleteItems: (cartItemIds) => deleteItems({ cartItemIds }),
      }
    : {
        // 게스트 cartItemId === recipeIngredientId
        onEditItem: (item, next) => updateGuestItem(item.cartItemId, next),
        onDeleteItems: (cartItemIds) => removeGuestItems(cartItemIds),
      };

  const cart = user ? serverCart.data : guestCart.cart;
  const isPending = user ? serverCart.isPending : guestCart.isPending;

  if (!isAuthReady || isPending) {
    return <div className="p-8" aria-busy="true" />;
  }
  if (!cart) return null;

  return (
    <div className="flex flex-col">
      {!user && (
        <div className="mx-auto w-full max-w-2xl px-4 pt-4">
          <GuestLoginBanner />
        </div>
      )}
      <CartContent cart={cart} handlers={handlers} />
    </div>
  );
};

export default CartView;
