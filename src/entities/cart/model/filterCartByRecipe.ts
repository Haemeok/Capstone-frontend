import type { CartResponse } from "../api/types";

export const filterCartByRecipe = (
  cart: CartResponse,
  selectedRecipeId: string | null
): CartResponse => {
  if (!selectedRecipeId) return cart;

  return {
    ...cart,
    groups: cart.groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => item.recipe.recipeId === selectedRecipeId
        ),
      }))
      .filter((group) => group.items.length > 0),
    unmatchedItems: cart.unmatchedItems.filter(
      (item) => item.recipe.recipeId === selectedRecipeId
    ),
  };
};
