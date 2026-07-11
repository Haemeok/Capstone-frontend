import type { CoupangRecipeItem } from "@/shared/coupang";

import type {
  CartGroup,
  CartItem,
  CartRecipeTab,
  CartResponse,
} from "../api/types";
import type { GuestCartItem } from "./guestCartStore";

export type GuestCoupangSource = {
  byIngredientId: Map<string, CoupangRecipeItem>;
  deletedRecipeIds: Set<string>;
};

// 게스트는 recipeIngredientId를 항목 ID로 사용 (서버 cartItemId 부재)
const toCartItem = (item: GuestCartItem, deleted: boolean): CartItem => ({
  cartItemId: item.recipeIngredientId,
  name: item.name,
  quantity: item.quantity,
  unit: item.unit,
  recipe: {
    recipeId: item.recipe.recipeId,
    title: item.recipe.title,
    deleted,
  },
});

export const buildGuestCartView = (
  items: GuestCartItem[],
  source: GuestCoupangSource
): CartResponse => {
  const groupsByName = new Map<string, CartGroup>();
  const unmatchedItems: CartItem[] = [];
  const tabs = new Map<string, CartRecipeTab>();

  items.forEach((item) => {
    const deleted = source.deletedRecipeIds.has(item.recipe.recipeId);

    const tab = tabs.get(item.recipe.recipeId);
    if (tab) {
      tab.itemCount += 1;
    } else {
      tabs.set(item.recipe.recipeId, {
        recipeId: item.recipe.recipeId,
        title: item.recipe.title,
        imageUrl: deleted ? null : item.recipe.imageUrl,
        itemCount: 1,
        deleted,
      });
    }

    const coupang = deleted
      ? undefined
      : source.byIngredientId.get(item.recipeIngredientId);
    if (!coupang) {
      unmatchedItems.push(toCartItem(item, deleted));
      return;
    }

    const existing = groupsByName.get(coupang.coupangName);
    if (existing) {
      existing.items.push(toCartItem(item, deleted));
    } else {
      groupsByName.set(coupang.coupangName, {
        coupangInfo: {
          coupangName: coupang.coupangName,
          landingUrl: coupang.landingUrl,
          lastCollectedAt: coupang.lastCollectedAt,
          products: coupang.products,
        },
        items: [toCartItem(item, deleted)],
      });
    }
  });

  return {
    totalItemCount: items.length,
    recipes: [...tabs.values()],
    groups: [...groupsByName.values()],
    unmatchedItems,
  };
};
