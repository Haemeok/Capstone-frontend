// i18n-ignore-file: 장바구니 ko 전용
"use client";

import type { CartItem, CartResponse } from "@/entities/cart";

import { CartItemRow } from "./CartItemRow";

export type CartHandlers = {
  onEditItem: (
    item: CartItem,
    next: { quantity: string; unit: string }
  ) => void;
  onDeleteItems: (cartItemIds: string[]) => void;
};

type CartContentProps = {
  cart: CartResponse;
  handlers: CartHandlers;
};

export const CartContent = ({ cart, handlers }: CartContentProps) => {
  void handlers;
  const allItems = [
    ...cart.groups.flatMap((group) => group.items),
    ...cart.unmatchedItems,
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 pt-4 pb-24">
      <h1 className="text-ink mb-4 text-xl font-bold">
        장바구니 <span className="text-olive-dark">{cart.totalItemCount}</span>
      </h1>
      <ul className="flex flex-col divide-y divide-gray-100">
        {allItems.map((item) => (
          <CartItemRow key={item.cartItemId} item={item} />
        ))}
      </ul>
    </div>
  );
};
