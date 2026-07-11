// i18n-ignore-file: 장바구니 ko 전용
"use client";

import { useState } from "react";

import { triggerHaptic } from "@/shared/lib/bridge";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/shadcn/drawer";

import type { CartItem } from "@/entities/cart";

type CartItemEditSheetProps = {
  item: CartItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    cartItemId: string,
    next: { quantity: string; unit: string }
  ) => void;
};

type CartItemEditFormProps = {
  item: CartItem;
  onSave: (next: { quantity: string; unit: string }) => void;
};

const CartItemEditForm = ({ item, onSave }: CartItemEditFormProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit);

  return (
    <>
      <DrawerTitle className="text-ink py-3 text-lg font-bold">
        {item.name}
      </DrawerTitle>
      <div className="flex gap-3">
        <label className="flex-1">
          <span className="text-ink-sub mb-1 block text-sm">수량</span>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="text-ink w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="flex-1">
          <span className="text-ink-sub mb-1 block text-sm">단위</span>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="text-ink w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => {
          triggerHaptic("Medium");
          onSave({ quantity, unit });
        }}
        className="bg-olive-light mt-5 w-full rounded-full py-3 font-semibold text-white"
      >
        저장
      </button>
    </>
  );
};

export const CartItemEditSheet = ({
  item,
  onOpenChange,
  onSubmit,
}: CartItemEditSheetProps) => (
  <Drawer open={item !== null} onOpenChange={onOpenChange}>
    <DrawerContent className="px-5 pb-8">
      {item && (
        <CartItemEditForm
          key={item.cartItemId}
          item={item}
          onSave={(next) => {
            onSubmit(item.cartItemId, next);
            onOpenChange(false);
          }}
        />
      )}
    </DrawerContent>
  </Drawer>
);
