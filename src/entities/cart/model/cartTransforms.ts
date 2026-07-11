import type { CartItem, CartResponse } from "../api/types";

const mapItems = (
  cart: CartResponse,
  fn: (item: CartItem) => CartItem | null
): CartResponse => {
  const groups = cart.groups
    .map((group) => ({
      ...group,
      items: group.items.map(fn).filter((i): i is CartItem => i !== null),
    }))
    .filter((group) => group.items.length > 0);
  const unmatchedItems = cart.unmatchedItems
    .map(fn)
    .filter((i): i is CartItem => i !== null);
  return { ...cart, groups, unmatchedItems };
};

const recount = (cart: CartResponse): CartResponse => {
  const countByRecipe = new Map<string, number>();
  const allItems = [
    ...cart.groups.flatMap((g) => g.items),
    ...cart.unmatchedItems,
  ];
  allItems.forEach((item) => {
    countByRecipe.set(
      item.recipe.recipeId,
      (countByRecipe.get(item.recipe.recipeId) ?? 0) + 1
    );
  });
  return {
    ...cart,
    totalItemCount: allItems.length,
    recipes: cart.recipes
      .map((r) => ({ ...r, itemCount: countByRecipe.get(r.recipeId) ?? 0 }))
      .filter((r) => r.itemCount > 0),
  };
};

export const removeItemsFromCart = (
  cart: CartResponse,
  cartItemIds: string[]
): CartResponse => {
  const ids = new Set(cartItemIds);
  return recount(
    mapItems(cart, (item) => (ids.has(item.cartItemId) ? null : item))
  );
};

// 서버 계약(null/빈 문자열 → 기존 값 유지)을 optimistic에도 동일 적용
export const updateItemInCart = (
  cart: CartResponse,
  cartItemId: string,
  next: { quantity?: string; unit?: string }
): CartResponse =>
  mapItems(cart, (item) =>
    item.cartItemId === cartItemId
      ? {
          ...item,
          quantity: next.quantity || item.quantity,
          unit: next.unit || item.unit,
        }
      : item
  );
