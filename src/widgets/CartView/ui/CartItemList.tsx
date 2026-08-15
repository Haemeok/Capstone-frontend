"use client";

import type { CartItem } from "@/entities/cart";
import { groupCartItemsByName } from "@/entities/cart";

import { CartIngredientGroup } from "./CartIngredientGroup";

type CartItemListProps = {
  items: CartItem[];
  onDelete: (cartItemIds: string[]) => void;
};

export const CartItemList = ({ items, onDelete }: CartItemListProps) => {
  const ingredientGroups = groupCartItemsByName(items);

  return (
    <ul className="flex flex-col divide-y divide-gray-100">
      {ingredientGroups.map((ingredientGroup) => (
        <CartIngredientGroup
          key={ingredientGroup.name}
          group={ingredientGroup}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
