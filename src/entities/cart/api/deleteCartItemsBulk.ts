import { api } from "@/shared/api/client";
import { END_POINTS } from "@/shared/config/constants/api";

export const deleteCartItemsBulk = (cartItemIds: string[]): Promise<void> =>
  api.delete<void>(END_POINTS.MY_CART_ITEMS_BULK, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItemIds }),
  });
